import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PurchaseOfferDto } from './dto/purchase-offer.dto';
import { User } from '../users/user.entity';
import {
  ACHIEVEMENT_DEFINITIONS,
  BOT_TRADERS as MARKET_BOT_TRADERS,
  DAILY_QUEST_DEFINITIONS,
  EVENT_TEMPLATES as MARKET_EVENT_TEMPLATES,
  MARKET_COMPANIES,
  NEWS_TEMPLATES as MARKET_NEWS_TEMPLATES,
  SECTOR_CONFIG,
  SESSION_STARTERS,
  STARTER_OFFERS as TOKEN_OFFERS,
  type CompanySeed,
} from './market.data';
import { AchievementProgress } from './entities/achievement-progress.entity';
import { DailyQuestProgress } from './entities/daily-quest-progress.entity';
import { EconomicEvent } from './entities/economic-event.entity';
import { Holding } from './entities/holding.entity';
import { MarketNews } from './entities/market-news.entity';
import { MonetizationOffer } from './entities/monetization-offer.entity';
import { Purchase } from './entities/purchase.entity';
import { SimCompany } from './entities/sim-company.entity';
import { SimPlayer } from './entities/sim-player.entity';
import { Trade, TradeSide } from './entities/trade.entity';

const STARTER_COMPANY_BY_SYMBOL = new Map(
  MARKET_COMPANIES.map((company) => [company.symbol, company]),
);
const EVENT_IMPACT_TICK_SCALE = 0.18;
const DEMAND_IMPACT_MAX_PERCENT = 1.35;
const MAX_TICK_GAIN_PERCENT = 2.2;
const MAX_TICK_DROP_PERCENT = -3.5;
const PRICE_FLOOR_MULTIPLIER = 0.25;
const PRICE_HARD_CEILING_MULTIPLIER = 6;
const MIN_LIVE_TRADE_COUNT = 8;
const MIN_TOTAL_TRADE_COUNT = 72;
const FIRST_SESSION_REWARD_TOKENS = 25;
const FIRST_SESSION_GUIDED_GAIN_PERCENT = 6;
const RETURN_WINDOW_MS = 20 * 60 * 60 * 1000;
const TRADING_GAME_ID = 'trading';
const VISIBLE_NEWS_COUNT = 4;

@Injectable()
export class MarketService implements OnModuleInit, OnModuleDestroy {
  private readonly autoTickIntervalMs = Number(
    process.env.MARKET_TICK_MS ?? 20000,
  );
  private autoTickTimer?: NodeJS.Timeout;
  private isAutoTickRunning = false;
  private lastAutoTickAt?: Date;
  private nextAutoTickAt?: Date;
  private newsSequence = 0;

  constructor(
    @InjectRepository(SimCompany)
    private readonly companiesRepository: Repository<SimCompany>,
    @InjectRepository(SimPlayer)
    private readonly playersRepository: Repository<SimPlayer>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Holding)
    private readonly holdingsRepository: Repository<Holding>,
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>,
    @InjectRepository(EconomicEvent)
    private readonly eventsRepository: Repository<EconomicEvent>,
    @InjectRepository(MarketNews)
    private readonly newsRepository: Repository<MarketNews>,
    @InjectRepository(MonetizationOffer)
    private readonly offersRepository: Repository<MonetizationOffer>,
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    @InjectRepository(AchievementProgress)
    private readonly achievementsRepository: Repository<AchievementProgress>,
    @InjectRepository(DailyQuestProgress)
    private readonly dailyQuestsRepository: Repository<DailyQuestProgress>,
  ) {}

  async onModuleInit() {
    await this.seedGameData();
    await this.ensureLiveBotActivity({ force: true });
    this.startAutoTicks();
  }

  onModuleDestroy() {
    if (this.autoTickTimer) {
      clearInterval(this.autoTickTimer);
    }
  }

  async seedGameData() {
    await this.seedCompanies();
    await this.seedBotTraders();

    await this.seedTokenOffers();

    await this.seedMarketHistory();
    await this.seedMarketNews();

    return {
      companies: await this.companiesRepository.count(),
      monetization_offers: await this.offersRepository.count(),
      trades: await this.tradesRepository.count(),
      news: await this.newsRepository.count(),
    };
  }

  private async seedCompanies() {
    for (const companySeed of MARKET_COMPANIES) {
      const existing = await this.companiesRepository.findOne({
        where: { symbol: companySeed.symbol },
      });

      if (!existing) {
        await this.companiesRepository.save(
          this.companiesRepository.create(companySeed),
        );
        continue;
      }

      const normalizedPrice = this.normalizeSeedPrice(existing, companySeed);
      await this.companiesRepository.save({
        ...existing,
        name: companySeed.name,
        sector: companySeed.sector,
        description: companySeed.description,
        owner_name: companySeed.owner_name,
        employee_count: companySeed.employee_count,
        founded_year: companySeed.founded_year,
        government_support_type: companySeed.government_support_type,
        government_support_amount: companySeed.government_support_amount,
        tax_benefit_percent: companySeed.tax_benefit_percent,
        state_loan_rate_percent: companySeed.state_loan_rate_percent,
        support_expires_year: companySeed.support_expires_year,
        support_risk_level: companySeed.support_risk_level,
        market_cap: companySeed.market_cap,
        volatility: companySeed.volatility,
        event_sensitivity: companySeed.event_sensitivity,
        price: normalizedPrice.price,
        previous_price: normalizedPrice.previous_price,
      });
    }
  }

  private async seedTokenOffers() {
    const tokenSkus = TOKEN_OFFERS.map((offer) => offer.sku);

    for (const offerSeed of TOKEN_OFFERS) {
      const existing = await this.offersRepository.findOne({
        where: { sku: offerSeed.sku },
      });

      const payload = {
        ...offerSeed,
        cash_reward: 0,
        premium_credit_reward: 0,
        is_active: true,
      };

      if (!existing) {
        await this.offersRepository.save(this.offersRepository.create(payload));
        continue;
      }

      await this.offersRepository.save({
        ...existing,
        ...payload,
      });
    }

    const allOffers = await this.offersRepository.find();
    const legacyOffers = allOffers.filter(
      (offer) => !tokenSkus.includes(offer.sku),
    );
    for (const offer of legacyOffers) {
      if (!offer.is_active) continue;
      offer.is_active = false;
      await this.offersRepository.save(offer);
    }
  }

  private async seedMarketNews() {
    const now = Date.now();

    for (const newsSeed of MARKET_NEWS_TEMPLATES) {
      const existing = await this.newsRepository.findOne({
        where: { slug: newsSeed.slug },
      });
      const scheduledAt = new Date(
        now + newsSeed.days_from_now * 24 * 60 * 60 * 1000,
      );
      const payload = {
        slug: newsSeed.slug,
        title: newsSeed.title,
        summary: newsSeed.summary,
        category: newsSeed.category,
        target_sector: newsSeed.target_sector,
        target_symbol: newsSeed.target_symbol,
        expected_impact_percent: newsSeed.expected_impact_percent,
        probability_percent: newsSeed.probability_percent,
        severity: newsSeed.severity,
        scheduled_at: scheduledAt,
        status: 'scheduled',
      };

      if (!existing) {
        await this.newsRepository.save(this.newsRepository.create(payload));
        continue;
      }

      await this.newsRepository.save({
        ...existing,
        ...payload,
      });
    }
  }

  private async seedBotTraders() {
    for (const bot of MARKET_BOT_TRADERS) {
      const existing = await this.playersRepository.findOne({
        where: { display_name: bot.name },
      });

      if (!existing) {
        await this.playersRepository.save(
          this.playersRepository.create({
            game_id: TRADING_GAME_ID,
            display_name: bot.name,
            cash_balance: bot.cash_balance,
            premium_credits: 0,
          }),
        );
        continue;
      }

      if (Number(existing.cash_balance) < 25000) {
        existing.cash_balance = bot.cash_balance;
        await this.playersRepository.save(existing);
      }
    }
  }

  getCompanies() {
    return this.companiesRepository.find({
      where: { is_active: true },
      order: { symbol: 'ASC' },
    });
  }

  getEvents() {
    return this.eventsRepository.find({
      order: { created_at: 'DESC' },
      take: 25,
    });
  }

  async getMarketNews() {
    const newsSlugs = MARKET_NEWS_TEMPLATES.map((item) => item.slug);
    const records = await this.newsRepository.find({
      where: { slug: In(newsSlugs) },
    });
    const recordsBySlug = new Map(records.map((item) => [item.slug, item]));
    const firstScheduledAt =
      this.nextAutoTickAt?.getTime() ??
      Date.now() + Math.max(this.autoTickIntervalMs, 1000);

    return Array.from({ length: VISIBLE_NEWS_COUNT }, (_, offset) => {
      const template =
        MARKET_NEWS_TEMPLATES[
          (this.newsSequence + offset) % MARKET_NEWS_TEMPLATES.length
        ];
      const record = recordsBySlug.get(template.slug);

      return {
        ...record,
        slug: template.slug,
        title: template.title,
        summary: template.summary,
        category: template.category,
        target_sector: template.target_sector,
        target_symbol: template.target_symbol,
        expected_impact_percent: template.expected_impact_percent,
        probability_percent: template.probability_percent,
        severity: template.severity,
        status: 'scheduled',
        scheduled_at: new Date(
          firstScheduledAt + offset * this.autoTickIntervalMs,
        ),
      };
    });
  }

  getMarketClock() {
    return {
      mode: 'automatic',
      tick_interval_ms: this.autoTickIntervalMs,
      last_tick_at: this.lastAutoTickAt,
      next_tick_at: this.nextAutoTickAt,
    };
  }

  async getMarketHistory() {
    await this.ensureLiveBotActivity();

    const [companies, trades] = await Promise.all([
      this.companiesRepository.find({
        where: { is_active: true },
        order: { symbol: 'ASC' },
      }),
      this.tradesRepository.find({ order: { created_at: 'DESC' }, take: 2000 }),
    ]);
    const playerIds = [...new Set(trades.map((trade) => trade.player_id))];
    const tradePlayers = playerIds.length
      ? await this.playersRepository.find({ where: { id: In(playerIds) } })
      : [];
    const playerNameById = new Map(
      tradePlayers.map((player) => [player.id, player.display_name]),
    );

    const insights = companies.map((company) => {
      const companyTrades = trades.filter(
        (trade) => trade.symbol === company.symbol,
      );
      const buyTrades = companyTrades.filter((trade) => trade.side === 'buy');
      const sellTrades = companyTrades.filter((trade) => trade.side === 'sell');
      const volume = companyTrades.reduce(
        (total, trade) => total + Number(trade.quantity),
        0,
      );
      const tradedValue = companyTrades.reduce(
        (total, trade) => total + Number(trade.gross_value),
        0,
      );
      const previousPrice = Number(company.previous_price);
      const currentPrice = Number(company.price);
      const priceChangePercent = previousPrice
        ? ((currentPrice - previousPrice) / previousPrice) * 100
        : 0;
      const buyPressure = companyTrades.length
        ? (buyTrades.length / companyTrades.length) * 100
        : 50;
      const averageTradePrice = companyTrades.length
        ? tradedValue / volume
        : currentPrice;
      const priceHistory = [...companyTrades]
        .sort(
          (first, second) =>
            first.created_at.getTime() - second.created_at.getTime(),
        )
        .map((trade) => ({
          price: Number(trade.execution_price),
          quantity: Number(trade.quantity),
          side: trade.side,
          created_at: trade.created_at,
        }));

      priceHistory.push({
        price: currentPrice,
        quantity: 0,
        side: currentPrice >= previousPrice ? 'buy' : 'sell',
        created_at: company.updated_at,
      });

      return {
        symbol: company.symbol,
        name: company.name,
        sector: company.sector,
        description: company.description,
        owner_name: company.owner_name,
        employee_count: company.employee_count,
        founded_year: company.founded_year,
        government_support_type: company.government_support_type,
        government_support_amount: Number(company.government_support_amount),
        tax_benefit_percent: Number(company.tax_benefit_percent),
        state_loan_rate_percent: Number(company.state_loan_rate_percent),
        support_expires_year: company.support_expires_year,
        support_risk_level: company.support_risk_level,
        current_price: currentPrice,
        previous_price: previousPrice,
        price_change_percent: this.roundPercent(priceChangePercent),
        recent_trades: companyTrades.length,
        buy_count: buyTrades.length,
        sell_count: sellTrades.length,
        volume: this.roundQuantity(volume),
        traded_value: this.roundMoney(tradedValue),
        average_trade_price: this.roundMoney(averageTradePrice),
        buy_pressure_percent: this.roundPercent(buyPressure),
        support_score: this.getSupportScore(company),
        signal: this.getTradingSignal(
          priceChangePercent,
          buyPressure,
          companyTrades.length,
          company,
        ),
        price_history: priceHistory,
      };
    });

    return {
      insights,
      trades: trades.slice(0, 300).map((trade) => ({
        id: trade.id,
        trader_name: playerNameById.get(trade.player_id) || 'Trader',
        symbol: trade.symbol,
        side: trade.side,
        quantity: Number(trade.quantity),
        execution_price: Number(trade.execution_price),
        gross_value: Number(trade.gross_value),
        fee: Number(trade.fee),
        created_at: trade.created_at,
      })),
    };
  }

  async createPlayer(dto: CreatePlayerDto) {
    if (!dto.display_name?.trim()) {
      throw new BadRequestException('display_name is required');
    }

    const player = this.playersRepository.create({
      user_id: dto.user_id,
      game_id: dto.game_id || TRADING_GAME_ID,
      display_name: dto.display_name.trim(),
      cash_balance: 10000,
      premium_credits: 0,
      first_session_started_at: new Date(),
    });

    return this.playersRepository.save(player);
  }

  async getPortfolio(playerId: number) {
    const player = await this.findPlayer(playerId);
    const user = player.user_id
      ? await this.usersRepository.findOneBy({ id: player.user_id })
      : null;
    const holdings = await this.holdingsRepository.find({
      where: { player_id: playerId },
    });
    const companies = holdings.length
      ? await this.companiesRepository.find({
          where: { id: In(holdings.map((holding) => holding.company_id)) },
        })
      : [];

    const positions = holdings.map((holding) => {
      const company = companies.find((item) => item.id === holding.company_id);
      const currentPrice = Number(company?.price ?? 0);
      const quantity = Number(holding.quantity);
      const averageCost = Number(holding.average_cost);
      const marketValue = this.roundMoney(quantity * currentPrice);

      return {
        symbol: company?.symbol,
        company_name: company?.name,
        quantity,
        average_cost: averageCost,
        current_price: currentPrice,
        market_value: marketValue,
        unrealized_pnl: this.roundMoney(marketValue - quantity * averageCost),
      };
    });

    const positionsValue = this.roundMoney(
      positions.reduce((total, position) => total + position.market_value, 0),
    );

    return {
      player,
      cash_balance: Number(player.cash_balance),
      account_tokens: Number(user?.account_tokens || 0),
      positions,
      positions_value: positionsValue,
      net_worth: this.roundMoney(Number(player.cash_balance) + positionsValue),
    };
  }

  async placeOrder(dto: PlaceOrderDto) {
    const symbol = dto.symbol?.trim().toUpperCase();
    const quantity = Number(dto.quantity);

    if (!symbol) {
      throw new BadRequestException('symbol is required');
    }

    if (!['buy', 'sell'].includes(dto.side)) {
      throw new BadRequestException('side must be buy or sell');
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity must be greater than 0');
    }

    const player = await this.findPlayer(Number(dto.player_id));
    const company = await this.companiesRepository.findOne({
      where: { symbol, is_active: true },
    });

    if (!company) {
      throw new NotFoundException(`Company ${symbol} was not found`);
    }

    const shouldGuideFirstTrade =
      this.isFirstSessionHumanPlayer(player) &&
      Number(player.first_session_trade_count || 0) === 0 &&
      dto.side === 'buy';

    const trade = await this.executeTrade(
      player,
      company,
      dto.side as TradeSide,
      quantity,
    );
    if (!trade) {
      throw new BadRequestException('Trade could not be executed');
    }

    const firstSession = await this.recordFirstSessionTrade(
      player,
      company,
      trade,
      shouldGuideFirstTrade,
    );

    return {
      trade,
      portfolio: await this.getPortfolio(player.id),
      first_session: firstSession,
    };
  }

  private async executeTrade(
    player: SimPlayer,
    company: SimCompany,
    side: TradeSide,
    quantity: number,
    options: { strict?: boolean; created_at?: Date } = {},
  ) {
    const strict = options.strict ?? true;
    const executionPrice = Number(company.price);
    const grossValue = this.roundMoney(quantity * executionPrice);
    const fee = this.roundMoney(Math.max(1, grossValue * 0.0025));
    const holding = await this.getOrCreateHolding(player.id, company.id);

    if (side === 'buy') {
      const totalCost = this.roundMoney(grossValue + fee);
      if (Number(player.cash_balance) < totalCost) {
        if (!strict) return null;
        throw new BadRequestException('Not enough simulated cash');
      }

      const currentQuantity = Number(holding.quantity);
      const currentCost = currentQuantity * Number(holding.average_cost);
      holding.quantity = currentQuantity + quantity;
      holding.average_cost = this.roundMoney(
        (currentCost + grossValue) / Number(holding.quantity),
      );
      player.cash_balance = this.roundMoney(
        Number(player.cash_balance) - totalCost,
      );
    } else {
      if (Number(holding.quantity) < quantity) {
        if (!strict) return null;
        throw new BadRequestException('Not enough tokens to sell');
      }

      holding.quantity = Number(holding.quantity) - quantity;
      player.cash_balance = this.roundMoney(
        Number(player.cash_balance) + grossValue - fee,
      );
      if (Number(holding.quantity) === 0) {
        holding.average_cost = 0;
      }
    }

    await this.playersRepository.save(player);
    await this.holdingsRepository.save(holding);

    const trade = await this.tradesRepository.save(
      this.tradesRepository.create({
        player_id: player.id,
        company_id: company.id,
        symbol: company.symbol,
        side,
        quantity,
        execution_price: executionPrice,
        gross_value: grossValue,
        fee,
        created_at: options.created_at,
      }),
    );

    await this.updateProgressAfterTrade(player, company, trade);
    return trade;
  }

  async runMarketTick() {
    const companies = await this.companiesRepository.find({
      where: { is_active: true },
    });
    if (companies.length === 0) {
      throw new BadRequestException(
        'Seed companies before running a market tick',
      );
    }

    const botTrades = await this.runBotTradingRound(companies);
    const demandTrades = await this.getRecentDemandTrades(botTrades);
    const eventTemplate = this.pickScheduledEventTemplate();
    const { sector_impacts: sectorImpacts, ...eventPayload } = eventTemplate;
    const event = await this.eventsRepository.save(
      this.eventsRepository.create({
        ...eventPayload,
        impact_profile: sectorImpacts,
        duration_ticks: 1,
      }),
    );

    const updatedCompanies = companies.map((company) => {
      const eventImpact =
        this.getEventImpact(company, event) * EVENT_IMPACT_TICK_SCALE;
      const demandImpact = this.getDemandImpactPercent(company, demandTrades);
      const supportEffect = this.getSupportPriceEffect(company, eventImpact);
      const noise = this.randomBetween(
        supportEffect.downsideVolatility,
        supportEffect.upsideVolatility,
      );
      const priceDrift = this.getPriceDriftPercent(company);
      const rawImpactPercent =
        eventImpact +
        demandImpact +
        noise +
        supportEffect.growthBias +
        priceDrift;
      const totalImpactPercent = this.clamp(
        rawImpactPercent,
        supportEffect.maxDropPercent,
        supportEffect.maxGainPercent,
      );
      const nextPrice = this.clampSimulatedPrice(
        company,
        Number(company.price) * (1 + totalImpactPercent / 100),
      );

      company.previous_price = Number(company.price);
      company.price = this.roundMoney(nextPrice);
      return company;
    });

    await this.companiesRepository.save(updatedCompanies);
    this.newsSequence =
      (this.newsSequence + 1) % MARKET_NEWS_TEMPLATES.length;

    return {
      event,
      companies: updatedCompanies.map((company) => ({
        symbol: company.symbol,
        name: company.name,
        previous_price: Number(company.previous_price),
        price: Number(company.price),
        demand_impact_percent: this.roundPercent(
          this.getDemandImpactPercent(company, demandTrades),
        ),
        support_score: this.getSupportScore(company),
        change_percent: this.roundPercent(
          ((Number(company.price) - Number(company.previous_price)) /
            Number(company.previous_price)) *
            100,
        ),
      })),
      bot_trades: botTrades.map((trade) => ({
        symbol: trade.symbol,
        side: trade.side,
        quantity: Number(trade.quantity),
        execution_price: Number(trade.execution_price),
      })),
    };
  }

  private async runBotTradingRound(companies: SimCompany[]) {
    const bots = await this.getBotPlayers();
    if (!bots.length || !companies.length) {
      return [];
    }

    const trades: Trade[] = [];
    const ordersCount = Math.floor(this.randomBetween(4, 10));

    for (let index = 0; index < ordersCount; index += 1) {
      const botConfig =
        MARKET_BOT_TRADERS[
          Math.floor(Math.random() * MARKET_BOT_TRADERS.length)
        ];
      const bot = bots.find((player) => player.display_name === botConfig.name);
      if (!bot) continue;

      const company = this.pickBotCompany(companies, botConfig.style);
      const side = await this.pickBotSide(bot, company, botConfig.style);
      const quantity = await this.getBotQuantity(bot, company, side);
      if (quantity <= 0) continue;

      const trade = await this.executeTrade(bot, company, side, quantity, {
        strict: false,
        created_at: new Date(),
      });

      if (trade) {
        trades.push(trade);
      }
    }

    return trades;
  }

  private async getBotPlayers() {
    return this.playersRepository.find({
      where: MARKET_BOT_TRADERS.map((bot) => ({ display_name: bot.name })),
    });
  }

  private pickBotCompany(companies: SimCompany[], style: string) {
    const sorted = [...companies].sort((first, second) => {
      const firstChange = this.getCompanyChangePercent(first);
      const secondChange = this.getCompanyChangePercent(second);
      const firstRatio = Number(first.price) / this.getFairPrice(first);
      const secondRatio = Number(second.price) / this.getFairPrice(second);

      if (style === 'momentum' || style === 'scalper')
        return secondChange - firstChange;
      if (style === 'value' || style === 'investor')
        return firstRatio - secondRatio;
      if (style === 'support')
        return this.getSupportScore(second) - this.getSupportScore(first);
      if (style === 'contrarian' || style === 'panic')
        return firstChange - secondChange;
      if (style === 'aggressive')
        return Number(second.volatility) - Number(first.volatility);
      if (style === 'market_maker')
        return Math.abs(firstChange) - Math.abs(secondChange);
      return Math.random() - 0.5;
    });

    const preferredPool = sorted.slice(0, Math.min(5, sorted.length));
    return (
      preferredPool[Math.floor(Math.random() * preferredPool.length)] ||
      companies[0]
    );
  }

  private async pickBotSide(
    bot: SimPlayer,
    company: SimCompany,
    style: string,
  ): Promise<TradeSide> {
    const holding = await this.holdingsRepository.findOne({
      where: { player_id: bot.id, company_id: company.id },
    });
    const hasInventory = Number(holding?.quantity || 0) > 0.2;
    const change = this.getCompanyChangePercent(company);
    const ratio = Number(company.price) / this.getFairPrice(company);
    const supportScore = this.getSupportScore(company);
    let buyProbability = 0.54;

    if (style === 'momentum') buyProbability += change > 0 ? 0.18 : -0.1;
    if (style === 'scalper') buyProbability += change > 0 ? 0.1 : -0.08;
    if (style === 'investor') buyProbability += ratio < 1.08 ? 0.16 : -0.08;
    if (style === 'value')
      buyProbability += ratio < 0.95 ? 0.24 : ratio > 1.18 ? -0.24 : 0;
    if (style === 'support') buyProbability += supportScore / 520;
    if (style === 'contrarian')
      buyProbability += change < -0.5 ? 0.24 : change > 1.1 ? -0.18 : 0;
    if (style === 'panic') buyProbability += change < 0 ? -0.28 : 0.08;
    if (style === 'aggressive') buyProbability += 0.2;
    if (style === 'market_maker')
      buyProbability = 0.5 + this.randomBetween(-0.08, 0.08);
    if (style === 'active' || style === 'random')
      buyProbability += this.randomBetween(-0.16, 0.16);

    buyProbability = this.clamp(buyProbability, 0.22, 0.82);
    if (!hasInventory) {
      return 'buy';
    }

    return Math.random() < buyProbability ? 'buy' : 'sell';
  }

  private async getBotQuantity(
    bot: SimPlayer,
    company: SimCompany,
    side: TradeSide,
  ) {
    const price = Number(company.price);
    if (!price || !Number.isFinite(price)) {
      return 0;
    }

    if (side === 'sell') {
      const holding = await this.holdingsRepository.findOne({
        where: { player_id: bot.id, company_id: company.id },
      });
      const inventory = Number(holding?.quantity || 0);
      return this.roundQuantity(
        Math.min(inventory, inventory * this.randomBetween(0.18, 0.55)),
      );
    }

    const spend = Math.min(
      Number(bot.cash_balance) * 0.08,
      this.randomBetween(450, 3200),
    );
    return this.roundQuantity(this.clamp(spend / price, 0.1, 42));
  }

  private async getRecentDemandTrades(botTrades: Trade[]) {
    const since = new Date(
      Date.now() - Math.max(this.autoTickIntervalMs * 2, 45000),
    );
    const recentTrades = await this.tradesRepository.find({
      where: { created_at: MoreThan(since) },
      order: { created_at: 'DESC' },
      take: 300,
    });

    const byId = new Map<number, Trade>();
    for (const trade of [...recentTrades, ...botTrades]) {
      byId.set(trade.id, trade);
    }
    return [...byId.values()];
  }

  private getDemandImpactPercent(company: SimCompany, trades: Trade[]) {
    const companyTrades = trades.filter(
      (trade) => trade.symbol === company.symbol,
    );
    if (!companyTrades.length) {
      return 0;
    }

    const buyValue = companyTrades
      .filter((trade) => trade.side === 'buy')
      .reduce((total, trade) => total + Number(trade.gross_value), 0);
    const sellValue = companyTrades
      .filter((trade) => trade.side === 'sell')
      .reduce((total, trade) => total + Number(trade.gross_value), 0);
    const totalValue = buyValue + sellValue;
    if (totalValue <= 0) {
      return 0;
    }

    const imbalance = (buyValue - sellValue) / totalValue;
    const activityBoost = Math.min(
      1,
      totalValue / Math.max(5000, Number(company.market_cap) / 100000),
    );
    return this.clamp(
      imbalance * activityBoost * DEMAND_IMPACT_MAX_PERCENT,
      -DEMAND_IMPACT_MAX_PERCENT,
      DEMAND_IMPACT_MAX_PERCENT,
    );
  }

  private startAutoTicks() {
    if (this.autoTickTimer || this.autoTickIntervalMs <= 0) {
      return;
    }

    this.nextAutoTickAt = new Date(Date.now() + this.autoTickIntervalMs);
    this.autoTickTimer = setInterval(() => {
      void this.runAutomaticTick();
    }, this.autoTickIntervalMs);

    this.autoTickTimer.unref?.();
  }

  private async runAutomaticTick() {
    if (this.isAutoTickRunning) {
      return;
    }

    this.isAutoTickRunning = true;
    try {
      await this.runMarketTick();
      this.lastAutoTickAt = new Date();
    } catch {
      // The next interval will try again; manual endpoints still expose the error.
    } finally {
      this.nextAutoTickAt = new Date(Date.now() + this.autoTickIntervalMs);
      this.isAutoTickRunning = false;
    }
  }

  private async ensureLiveBotActivity(options: { force?: boolean } = {}) {
    const recentWindowMs = Math.max(this.autoTickIntervalMs * 2, 60000);
    const recentSince = new Date(Date.now() - recentWindowMs);
    const [totalTrades, recentTrades] = await Promise.all([
      this.tradesRepository.count(),
      this.tradesRepository.count({
        where: { created_at: MoreThan(recentSince) },
      }),
    ]);

    const needsWarmup = totalTrades < MIN_TOTAL_TRADE_COUNT;
    const needsRecentActivity = recentTrades < MIN_LIVE_TRADE_COUNT;

    if (!options.force && !needsWarmup && !needsRecentActivity) {
      return;
    }

    const tickCount = needsWarmup ? 3 : 1;
    for (let tick = 0; tick < tickCount; tick += 1) {
      await this.runAutomaticTick();
    }
  }

  getMonetizationOffers() {
    return this.offersRepository.find({
      where: { is_active: true },
      order: { price_usd: 'ASC' },
    });
  }

  getSessionStarters() {
    return SESSION_STARTERS;
  }

  async purchaseOffer(dto: PurchaseOfferDto) {
    const player = await this.findPlayer(Number(dto.player_id));
    const user = await this.ensureVerifiedAccountPlayer(player);
    const offer = await this.offersRepository.findOne({
      where: { id: Number(dto.offer_id), is_active: true },
    });

    if (!offer) {
      throw new NotFoundException('Offer was not found');
    }

    if (offer.type !== 'token_pack') {
      throw new BadRequestException(
        'Only token packs can be purchased in the store',
      );
    }

    user.account_tokens = this.roundMoney(
      Number(user.account_tokens) + Number(offer.token_reward),
    );
    user.lifetime_tokens_earned = this.roundMoney(
      Number(user.lifetime_tokens_earned || 0) + Number(offer.token_reward),
    );
    await this.usersRepository.save(user);

    const purchase = await this.purchasesRepository.save(
      this.purchasesRepository.create({
        player_id: player.id,
        game_id: dto.game_id || player.game_id || TRADING_GAME_ID,
        offer_id: offer.id,
        sku: offer.sku,
        price_usd: Number(offer.price_usd),
        status: 'simulated',
      }),
    );

    return {
      purchase,
      player,
      user: this.publicUser(user),
      token_reward: Number(offer.token_reward),
      note: 'This is a simulated purchase record. Connect a payment provider before charging real money.',
    };
  }

  async startSessionWithTokens(dto: {
    player_id: number;
    starter_sku?: string;
  }) {
    const player = await this.findPlayer(Number(dto.player_id));
    const user = await this.ensureVerifiedAccountPlayer(player);
    const starter =
      SESSION_STARTERS.find((item) => item.sku === dto.starter_sku) ||
      SESSION_STARTERS[0];

    if (Number(user.account_tokens || 0) < starter.token_cost) {
      throw new BadRequestException(
        'Not enough account tokens for this session starter',
      );
    }

    user.account_tokens = this.roundMoney(
      Number(user.account_tokens || 0) - starter.token_cost,
    );
    user.lifetime_tokens_spent = this.roundMoney(
      Number(user.lifetime_tokens_spent || 0) + starter.token_cost,
    );
    player.cash_balance = starter.cash;
    player.premium_credits = 0;
    await this.holdingsRepository.delete({ player_id: player.id });
    await this.usersRepository.save(user);
    await this.playersRepository.save(player);

    return {
      starter,
      user: this.publicUser(user),
      portfolio: await this.getPortfolio(player.id),
    };
  }

  async getProgression(playerId: number) {
    const player = await this.findPlayer(Number(playerId));
    const user = await this.ensureVerifiedAccountPlayer(player);
    const today = this.todayKey();
    const [achievements, dailyQuests] = await Promise.all([
      this.achievementsRepository.find({
        where: { user_id: user.id, game_id: TRADING_GAME_ID, scope: 'game' },
      }),
      this.dailyQuestsRepository.find({
        where: { user_id: user.id, game_id: TRADING_GAME_ID, quest_date: today },
      }),
    ]);

    const achievementByCode = new Map(
      achievements.map((item) => [item.code, item]),
    );
    const questByCode = new Map(dailyQuests.map((item) => [item.code, item]));

    return {
      user: this.publicUser(user),
      session_starters: SESSION_STARTERS,
      achievements: ACHIEVEMENT_DEFINITIONS.map((definition) => ({
        ...definition,
        progress: Number(achievementByCode.get(definition.code)?.progress || 0),
        completed: achievementByCode.get(definition.code)?.completed || false,
      })),
      daily_quests: DAILY_QUEST_DEFINITIONS.map((definition) => ({
        ...definition,
        quest_date: today,
        progress: Number(questByCode.get(definition.code)?.progress || 0),
        completed: questByCode.get(definition.code)?.completed || false,
      })),
    };
  }

  async getFirstSessionMetrics() {
    const players = await this.playersRepository.find();
    const startedPlayers = players.filter(
      (player) => player.first_session_started_at,
    );
    const completedPlayers = startedPlayers.filter(
      (player) => player.first_session_completed_at,
    );
    const secondTradePlayers = startedPlayers.filter(
      (player) => Number(player.first_session_trade_count || 0) >= 2,
    );
    const returnedPlayers = completedPlayers.filter(
      (player) => player.first_session_returned_at,
    );
    const durations = completedPlayers
      .map((player) => {
        const started = player.first_session_started_at?.getTime();
        const completed = player.first_session_completed_at?.getTime();
        return started && completed ? completed - started : 0;
      })
      .filter((duration) => duration > 0);

    const averageDurationMs = durations.length
      ? Math.round(
          durations.reduce((total, duration) => total + duration, 0) /
            durations.length,
        )
      : 0;

    return {
      started: startedPlayers.length,
      completed: completedPlayers.length,
      completion_percent: this.roundPercent(
        startedPlayers.length
          ? (completedPlayers.length / startedPlayers.length) * 100
          : 0,
      ),
      second_trade_percent: this.roundPercent(
        startedPlayers.length
          ? (secondTradePlayers.length / startedPlayers.length) * 100
          : 0,
      ),
      day_1_retention_percent: this.roundPercent(
        completedPlayers.length
          ? (returnedPlayers.length / completedPlayers.length) * 100
          : 0,
      ),
      average_first_session_duration_ms: averageDurationMs,
    };
  }

  private async findPlayer(playerId: number) {
    if (!Number.isInteger(playerId)) {
      throw new BadRequestException('player_id must be a number');
    }

    const player = await this.playersRepository.findOneBy({ id: playerId });
    if (!player) {
      throw new NotFoundException('Player was not found');
    }

    await this.markFirstSessionReturn(player);
    return player;
  }

  private isFirstSessionHumanPlayer(player: SimPlayer) {
    if (player.display_name === 'Market Maker') return false;
    return !MARKET_BOT_TRADERS.some((bot) => bot.name === player.display_name);
  }

  private async markFirstSessionReturn(player: SimPlayer) {
    if (
      !this.isFirstSessionHumanPlayer(player) ||
      !player.first_session_completed_at ||
      player.first_session_returned_at
    ) {
      return;
    }

    const elapsed = Date.now() - player.first_session_completed_at.getTime();
    if (elapsed < RETURN_WINDOW_MS) return;

    player.first_session_returned_at = new Date();
    await this.playersRepository.save(player);
  }

  private async recordFirstSessionTrade(
    player: SimPlayer,
    company: SimCompany,
    trade: Trade,
    shouldGuideFirstTrade: boolean,
  ) {
    if (!this.isFirstSessionHumanPlayer(player)) return null;

    const now = new Date();
    if (!player.first_session_started_at) {
      player.first_session_started_at = player.created_at || now;
    }

    player.first_session_trade_count =
      Number(player.first_session_trade_count || 0) + 1;

    if (
      Number(player.first_session_trade_count) >= 2 &&
      !player.first_session_second_trade_at
    ) {
      player.first_session_second_trade_at = now;
    }

    if (!shouldGuideFirstTrade || player.first_session_completed_at) {
      await this.playersRepository.save(player);
      return null;
    }

    const oldPrice = Number(company.price);
    const boostedPrice = this.roundMoney(
      Math.max(
        oldPrice + 0.01,
        oldPrice * (1 + FIRST_SESSION_GUIDED_GAIN_PERCENT / 100),
      ),
    );
    company.previous_price = oldPrice;
    company.price = boostedPrice;
    await this.companiesRepository.save(company);

    player.first_session_status = 'completed';
    player.first_session_completed_at = now;
    player.first_session_reward_tokens = this.roundMoney(
      Number(player.first_session_reward_tokens || 0) +
        FIRST_SESSION_REWARD_TOKENS,
    );

    let user: User | null = null;
    if (player.user_id) {
      user = await this.usersRepository.findOneBy({ id: player.user_id });
      if (user?.email_verified) {
        user.account_tokens = this.roundMoney(
          Number(user.account_tokens || 0) + FIRST_SESSION_REWARD_TOKENS,
        );
        user.lifetime_tokens_earned = this.roundMoney(
          Number(user.lifetime_tokens_earned || 0) +
            FIRST_SESSION_REWARD_TOKENS,
        );
        await this.usersRepository.save(user);
      }
    }

    await this.playersRepository.save(player);

    return {
      status: 'completed',
      reward_tokens: FIRST_SESSION_REWARD_TOKENS,
      pending_registration: !user?.email_verified,
      achievement_code: 'first_trade',
      title: 'First profitable trade',
      result_explanation:
        'You bought after positive demand appeared. The market moved up and your position is already profitable.',
      next_hook:
        'A new market mission unlocks next: make a second trade after reading the next news signal.',
      old_price: oldPrice,
      new_price: boostedPrice,
      unrealized_profit: this.roundMoney(
        Number(trade.quantity) *
          (boostedPrice - Number(trade.execution_price)) -
          Number(trade.fee),
      ),
      account_tokens: Number(user?.account_tokens || 0),
    };
  }

  private async ensureVerifiedAccountPlayer(player: SimPlayer) {
    if (!player.user_id) {
      throw new BadRequestException(
        'Register and verify email before buying currency',
      );
    }

    const user = await this.usersRepository.findOneBy({ id: player.user_id });
    if (!user?.email_verified) {
      throw new BadRequestException('Verify email before buying currency');
    }

    return user;
  }

  private async updateProgressAfterTrade(
    player: SimPlayer,
    company: SimCompany,
    trade: Trade,
  ) {
    if (!player.user_id) return;

    const user = await this.usersRepository.findOneBy({ id: player.user_id });
    if (!user?.email_verified) return;

    await this.incrementAchievementMetric(user, 'total_trades', 1);
    await this.incrementDailyQuestMetric(user, 'total_trades', 1);

    if (trade.side === 'buy') {
      await this.incrementDailyQuestMetric(
        user,
        `buy_sector:${company.sector}`,
        1,
      );
    }
  }

  private async incrementAchievementMetric(
    user: User,
    metric: string,
    amount: number,
  ) {
    const definitions = ACHIEVEMENT_DEFINITIONS.filter(
      (definition) => definition.metric === metric,
    );

    for (const definition of definitions) {
      let progress = await this.achievementsRepository.findOne({
        where: {
          user_id: user.id,
          game_id: TRADING_GAME_ID,
          scope: 'game',
          code: definition.code,
        },
      });

      if (!progress) {
        progress = this.achievementsRepository.create({
          user_id: user.id,
          game_id: TRADING_GAME_ID,
          scope: 'game',
          code: definition.code,
          progress: 0,
          completed: false,
        });
      }

      if (progress.completed) continue;

      progress.progress = this.roundQuantity(
        Number(progress.progress) + amount,
      );
      if (Number(progress.progress) >= definition.target) {
        progress.completed = true;
        progress.completed_at = new Date();
        user.account_tokens = this.roundMoney(
          Number(user.account_tokens || 0) + definition.token_reward,
        );
        user.lifetime_tokens_earned = this.roundMoney(
          Number(user.lifetime_tokens_earned || 0) + definition.token_reward,
        );
        await this.usersRepository.save(user);
      }

      await this.achievementsRepository.save(progress);
    }
  }

  private async incrementDailyQuestMetric(
    user: User,
    metric: string,
    amount: number,
  ) {
    const today = this.todayKey();
    const definitions = DAILY_QUEST_DEFINITIONS.filter(
      (definition) => definition.metric === metric,
    );

    for (const definition of definitions) {
      let progress = await this.dailyQuestsRepository.findOne({
        where: {
          user_id: user.id,
          game_id: TRADING_GAME_ID,
          quest_date: today,
          code: definition.code,
        },
      });

      if (!progress) {
        progress = this.dailyQuestsRepository.create({
          user_id: user.id,
          game_id: TRADING_GAME_ID,
          quest_date: today,
          code: definition.code,
          progress: 0,
          completed: false,
        });
      }

      if (progress.completed) continue;

      progress.progress = this.roundQuantity(
        Number(progress.progress) + amount,
      );
      if (Number(progress.progress) >= definition.target) {
        progress.completed = true;
        progress.completed_at = new Date();
        user.account_tokens = this.roundMoney(
          Number(user.account_tokens || 0) + definition.token_reward,
        );
        user.lifetime_tokens_earned = this.roundMoney(
          Number(user.lifetime_tokens_earned || 0) + definition.token_reward,
        );
        await this.usersRepository.save(user);
      }

      await this.dailyQuestsRepository.save(progress);
    }
  }

  private todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  private publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      email_verified: user.email_verified,
      account_tokens: Number(user.account_tokens),
      login_streak: user.login_streak,
    };
  }

  private async getOrCreateHolding(playerId: number, companyId: number) {
    const existing = await this.holdingsRepository.findOne({
      where: { player_id: playerId, company_id: companyId },
    });

    if (existing) {
      return existing;
    }

    return this.holdingsRepository.create({
      player_id: playerId,
      company_id: companyId,
      quantity: 0,
      average_cost: 0,
    });
  }

  private async seedMarketHistory() {
    const companies = await this.companiesRepository.find({
      where: { is_active: true },
    });
    if (companies.length === 0) {
      return;
    }

    let bot = await this.playersRepository.findOne({
      where: { display_name: 'Market Maker' },
    });

    if (!bot) {
      bot = await this.playersRepository.save(
        this.playersRepository.create({
          display_name: 'Market Maker',
          cash_balance: 100000,
          premium_credits: 0,
        }),
      );
    } else if (Number(bot.cash_balance) < 25000) {
      bot.cash_balance = 100000;
      bot = await this.playersRepository.save(bot);
    }

    const trades: Trade[] = [];

    for (const company of companies) {
      const existingCount = await this.tradesRepository.count({
        where: { symbol: company.symbol },
      });
      const missingCount = Math.max(0, 6 - existingCount);

      Array.from({ length: missingCount }, (_, index) => {
        const side = index % 3 === 0 ? 'sell' : 'buy';
        const quantity = this.roundQuantity(this.randomBetween(3, 24));
        const price = this.roundMoney(
          Number(company.price) * (1 + this.randomBetween(-0.08, 0.08)),
        );
        const grossValue = this.roundMoney(quantity * price);

        const trade = this.tradesRepository.create({
          player_id: bot.id,
          company_id: company.id,
          symbol: company.symbol,
          side,
          quantity,
          execution_price: price,
          gross_value: grossValue,
          fee: this.roundMoney(Math.max(1, grossValue * 0.0025)),
          created_at: new Date(
            Date.now() - (index + company.id * 7) * 60 * 60 * 1000,
          ),
        });
        trades.push(trade);
      });
    }

    if (trades.length > 0) {
      await this.tradesRepository.save(trades);
    }
  }

  private getTradingSignal(
    priceChangePercent: number,
    buyPressurePercent: number,
    recentTrades: number,
    company?: SimCompany,
  ) {
    if (recentTrades < 3) {
      return 'Thin history';
    }

    const supportScore = company ? this.getSupportScore(company) : 0;

    if (supportScore >= 70 && buyPressurePercent >= 55) {
      return 'State-backed';
    }

    if (priceChangePercent > 2 && buyPressurePercent >= 60) {
      return 'Momentum';
    }

    if (priceChangePercent < -2 && buyPressurePercent <= 45) {
      return 'Caution';
    }

    if (buyPressurePercent >= 65) {
      return 'Accumulation';
    }

    if (buyPressurePercent <= 35) {
      return 'Distribution';
    }

    return 'Balanced';
  }

  private getSupportPriceEffect(company: SimCompany, eventImpact: number) {
    const supportScore = this.getSupportScore(company);
    const volatility = Number(company.volatility);

    if (supportScore <= 0) {
      return {
        growthBias: 0,
        downsideVolatility: -volatility * 0.32,
        upsideVolatility: volatility * 0.32,
        maxDropPercent: MAX_TICK_DROP_PERCENT,
        maxGainPercent: MAX_TICK_GAIN_PERCENT,
      };
    }

    const supportRatio = supportScore / 100;
    const growthBias = 0.02 + supportRatio * 0.1;
    const downsideVolatility = -volatility * (0.22 - supportRatio * 0.1);
    const upsideVolatility = volatility * 0.24;
    const maxDropPercent = -(1.35 - supportRatio * 0.75);
    const maxGainPercent = 1.45 + supportRatio * 0.45;

    if (eventImpact < 0 && supportScore >= 70) {
      return {
        growthBias: growthBias + 0.05,
        downsideVolatility: Math.max(downsideVolatility, -0.45),
        upsideVolatility,
        maxDropPercent: Math.max(maxDropPercent, -0.65),
        maxGainPercent,
      };
    }

    return {
      growthBias,
      downsideVolatility,
      upsideVolatility,
      maxDropPercent,
      maxGainPercent,
    };
  }

  private getSupportScore(company: SimCompany) {
    let score = 0;

    if (
      company.government_support_type &&
      company.government_support_type !== 'none'
    ) {
      score += 30;
    }

    score += Math.min(35, Number(company.government_support_amount) / 1000000);
    score += Math.min(20, Number(company.tax_benefit_percent));

    const loanRate = Number(company.state_loan_rate_percent);
    if (loanRate > 0 && loanRate <= 2.5) {
      score += 15;
    }

    if (company.support_risk_level === 'high') {
      score -= 15;
    }

    return Math.max(0, Math.min(100, this.roundPercent(score)));
  }

  private pickEventTemplate() {
    return MARKET_EVENT_TEMPLATES[
      Math.floor(Math.random() * MARKET_EVENT_TEMPLATES.length)
    ];
  }

  private pickScheduledEventTemplate() {
    const newsTemplate =
      MARKET_NEWS_TEMPLATES[
        this.newsSequence % MARKET_NEWS_TEMPLATES.length
      ];

    return (
      MARKET_EVENT_TEMPLATES.find(
        (event) => event.title === newsTemplate.linked_event_title,
      ) || this.pickEventTemplate()
    );
  }

  private getEventImpact(company: SimCompany, event: EconomicEvent) {
    const sectorImpact = event.impact_profile?.[company.sector];
    if (typeof sectorImpact === 'number') {
      return sectorImpact * Number(company.event_sensitivity || 1);
    }

    if (event.scope === 'global') {
      return (
        Number(event.price_impact_percent) *
        this.getSectorSensitivity(company, event.category) *
        Number(company.event_sensitivity || 1)
      );
    }

    if (event.scope === 'sector' && event.target_sector === company.sector) {
      return (
        Number(event.price_impact_percent) *
        Number(company.event_sensitivity || 1)
      );
    }

    if (event.scope === 'company' && event.target_symbol === company.symbol) {
      return (
        Number(event.price_impact_percent) *
        Number(company.event_sensitivity || 1)
      );
    }

    return 0;
  }

  private getSectorSensitivity(company: SimCompany, category: string) {
    const config = SECTOR_CONFIG[company.sector as keyof typeof SECTOR_CONFIG];
    if (!config) return 1;

    if (category === 'Interest Rates') return config.rateSensitivity;
    if (category === 'War') return config.warSensitivity;
    if (category === 'Technology') return config.techSensitivity;
    return 1;
  }

  private normalizeSeedPrice(existing: SimCompany, companySeed: CompanySeed) {
    const fairPrice = Number(companySeed.price);
    const currentPrice = Number(existing.price);
    const previousPrice = Number(existing.previous_price);
    const floor = fairPrice * PRICE_FLOOR_MULTIPLIER;
    const hardCeiling = fairPrice * PRICE_HARD_CEILING_MULTIPLIER;

    if (
      !Number.isFinite(currentPrice) ||
      currentPrice < floor ||
      currentPrice > hardCeiling
    ) {
      return {
        price: fairPrice,
        previous_price: fairPrice,
      };
    }

    return {
      price: currentPrice,
      previous_price: Number.isFinite(previousPrice)
        ? this.clamp(previousPrice, floor, hardCeiling)
        : currentPrice,
    };
  }

  private getPriceDriftPercent(company: SimCompany) {
    const fairPrice = this.getFairPrice(company);
    const currentPrice = Number(company.price);
    if (!fairPrice || !Number.isFinite(currentPrice)) {
      return 0;
    }

    const ratio = currentPrice / fairPrice;
    if (ratio > 8) return -2.8;
    if (ratio > 5) return -1.5;
    if (ratio > 3) return -0.65;
    if (ratio < 0.5) return 0.35;
    if (ratio < 0.8) return 0.14;
    return 0;
  }

  private getCompanyChangePercent(company: SimCompany) {
    const previousPrice = Number(company.previous_price);
    const currentPrice = Number(company.price);
    if (
      !previousPrice ||
      !Number.isFinite(previousPrice) ||
      !Number.isFinite(currentPrice)
    ) {
      return 0;
    }

    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }

  private clampSimulatedPrice(company: SimCompany, nextPrice: number) {
    const fairPrice = this.getFairPrice(company);
    if (!fairPrice || !Number.isFinite(nextPrice)) {
      return Math.max(1, Number(company.price) || 1);
    }

    return this.clamp(
      nextPrice,
      Math.max(1, fairPrice * PRICE_FLOOR_MULTIPLIER),
      fairPrice * PRICE_HARD_CEILING_MULTIPLIER,
    );
  }

  private getFairPrice(company: SimCompany) {
    return Number(
      STARTER_COMPANY_BY_SYMBOL.get(company.symbol)?.price ||
        company.price ||
        0,
    );
  }

  private randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  private roundMoney(value: number) {
    return Math.round(value * 100) / 100;
  }

  private roundPercent(value: number) {
    return Math.round(value * 10000) / 10000;
  }

  private roundQuantity(value: number) {
    return Math.round(value * 10000) / 10000;
  }
}
