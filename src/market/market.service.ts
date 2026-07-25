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
import { EconomicEvent } from './entities/economic-event.entity';
import { Holding } from './entities/holding.entity';
import { MarketNews } from './entities/market-news.entity';
import { MonetizationOffer } from './entities/monetization-offer.entity';
import { Purchase } from './entities/purchase.entity';
import { SimCompany } from './entities/sim-company.entity';
import { SimPlayer } from './entities/sim-player.entity';
import { Trade, TradeSide } from './entities/trade.entity';

const STARTER_COMPANIES = [
  {
    symbol: 'NOVA',
    name: 'Nova Robotics',
    sector: 'AI',
    description:
      'Builds autonomous warehouse robots and machine-vision systems for logistics companies.',
    owner_name: 'Maya Levin',
    employee_count: 1240,
    founded_year: 2017,
    government_support_type: 'R&D grant',
    government_support_amount: 18000000,
    tax_benefit_percent: 8,
    state_loan_rate_percent: 0,
    support_expires_year: 2029,
    support_risk_level: 'medium',
    price: 42,
    previous_price: 42,
    market_cap: 420000000,
    volatility: 4.5,
  },
  {
    symbol: 'SOLR',
    name: 'Solara Grid',
    sector: 'Energy',
    description:
      'Operates smart solar microgrids and battery balancing software for midsize cities.',
    owner_name: 'Daniel Cross',
    employee_count: 860,
    founded_year: 2014,
    government_support_type: 'Green energy tax credit',
    government_support_amount: 24000000,
    tax_benefit_percent: 14,
    state_loan_rate_percent: 2.1,
    support_expires_year: 2031,
    support_risk_level: 'low',
    price: 26,
    previous_price: 26,
    market_cap: 260000000,
    volatility: 3.25,
  },
  {
    symbol: 'MEDX',
    name: 'Medix Labs',
    sector: 'Healthcare',
    description:
      'Develops diagnostic lab tools and AI-assisted screening kits for clinics.',
    owner_name: 'Dr. Elena Mor',
    employee_count: 530,
    founded_year: 2019,
    government_support_type: 'Health innovation grant',
    government_support_amount: 9000000,
    tax_benefit_percent: 5,
    state_loan_rate_percent: 0,
    support_expires_year: 2028,
    support_risk_level: 'medium',
    price: 18,
    previous_price: 18,
    market_cap: 180000000,
    volatility: 5.1,
  },
  {
    symbol: 'BYTE',
    name: 'ByteForge Games',
    sector: 'Gaming',
    description:
      'Publishes competitive mobile games and live-service economies for esports fans.',
    owner_name: 'Noam Adler',
    employee_count: 410,
    founded_year: 2021,
    government_support_type: 'none',
    government_support_amount: 0,
    tax_benefit_percent: 0,
    state_loan_rate_percent: 0,
    support_expires_year: 0,
    support_risk_level: 'none',
    price: 12,
    previous_price: 12,
    market_cap: 120000000,
    volatility: 6,
  },
  {
    symbol: 'AERO',
    name: 'AeroVista Drones',
    sector: 'Aerospace',
    description:
      'Makes inspection drones for ports, farms, and construction sites with long-range sensors.',
    owner_name: 'Sofia Grant',
    employee_count: 720,
    founded_year: 2016,
    government_support_type: 'Defense supplier credit line',
    government_support_amount: 32000000,
    tax_benefit_percent: 6,
    state_loan_rate_percent: 1.8,
    support_expires_year: 2030,
    support_risk_level: 'medium',
    price: 31,
    previous_price: 31,
    market_cap: 310000000,
    volatility: 4.8,
  },
  {
    symbol: 'FARM',
    name: 'FarmPulse Foods',
    sector: 'Agriculture',
    description:
      'Runs vertical farms and crop analytics for supermarkets seeking local produce supply.',
    owner_name: 'Ilan Becker',
    employee_count: 640,
    founded_year: 2015,
    government_support_type: 'Food security subsidy',
    government_support_amount: 14000000,
    tax_benefit_percent: 10,
    state_loan_rate_percent: 2.4,
    support_expires_year: 2027,
    support_risk_level: 'high',
    price: 15,
    previous_price: 15,
    market_cap: 150000000,
    volatility: 3.9,
  },
  {
    symbol: 'FINX',
    name: 'FinAxis Pay',
    sector: 'Fintech',
    description:
      'Provides simulated payment rails, fraud scoring, and merchant settlement tools.',
    owner_name: 'Ari Stone',
    employee_count: 1180,
    founded_year: 2013,
    government_support_type: 'none',
    government_support_amount: 0,
    tax_benefit_percent: 0,
    state_loan_rate_percent: 0,
    support_expires_year: 0,
    support_risk_level: 'none',
    price: 38,
    previous_price: 38,
    market_cap: 380000000,
    volatility: 5.4,
  },
  {
    symbol: 'EDU',
    name: 'EduCore Cloud',
    sector: 'Education',
    description:
      'Sells learning platforms, exams, and analytics dashboards to schools and bootcamps.',
    owner_name: 'Rachel Kim',
    employee_count: 350,
    founded_year: 2018,
    government_support_type: 'Education modernization tender',
    government_support_amount: 7000000,
    tax_benefit_percent: 4,
    state_loan_rate_percent: 0,
    support_expires_year: 2028,
    support_risk_level: 'low',
    price: 11,
    previous_price: 11,
    market_cap: 110000000,
    volatility: 4.1,
  },
  {
    symbol: 'CYBR',
    name: 'CipherWall Security',
    sector: 'Cybersecurity',
    description:
      'Protects small businesses with endpoint defense, password audits, and incident response.',
    owner_name: 'Victor Hale',
    employee_count: 970,
    founded_year: 2012,
    government_support_type: 'Critical infrastructure contract',
    government_support_amount: 21000000,
    tax_benefit_percent: 3,
    state_loan_rate_percent: 1.5,
    support_expires_year: 2029,
    support_risk_level: 'medium',
    price: 47,
    previous_price: 47,
    market_cap: 470000000,
    volatility: 5.7,
  },
  {
    symbol: 'OCEA',
    name: 'OceanArc Shipping',
    sector: 'Logistics',
    description:
      'Coordinates container routes, port scheduling, and fuel optimization for regional fleets.',
    owner_name: 'Lina Torres',
    employee_count: 1540,
    founded_year: 2009,
    government_support_type: 'Port logistics loan',
    government_support_amount: 26000000,
    tax_benefit_percent: 2,
    state_loan_rate_percent: 2.8,
    support_expires_year: 2032,
    support_risk_level: 'low',
    price: 21,
    previous_price: 21,
    market_cap: 210000000,
    volatility: 3.6,
  },
  {
    symbol: 'FOAM',
    name: 'FoamLite Materials',
    sector: 'Manufacturing',
    description:
      'Produces lightweight insulation panels and recyclable packaging materials.',
    owner_name: 'Peter Novak',
    employee_count: 780,
    founded_year: 2011,
    government_support_type: 'Manufacturing tax relief',
    government_support_amount: 11000000,
    tax_benefit_percent: 9,
    state_loan_rate_percent: 0,
    support_expires_year: 2026,
    support_risk_level: 'high',
    price: 17,
    previous_price: 17,
    market_cap: 170000000,
    volatility: 4.4,
  },
  {
    symbol: 'LUX',
    name: 'Luxora Retail',
    sector: 'Consumer',
    description:
      'Runs premium lifestyle stores and a direct-to-consumer brand marketplace.',
    owner_name: 'Nadia Wells',
    employee_count: 1320,
    founded_year: 2010,
    government_support_type: 'none',
    government_support_amount: 0,
    tax_benefit_percent: 0,
    state_loan_rate_percent: 0,
    support_expires_year: 0,
    support_risk_level: 'none',
    price: 24,
    previous_price: 24,
    market_cap: 240000000,
    volatility: 4.9,
  },
];

const STARTER_COMPANY_BY_SYMBOL = new Map(
  STARTER_COMPANIES.map((company) => [company.symbol, company]),
);
const EVENT_IMPACT_TICK_SCALE = 0.18;
const DEMAND_IMPACT_MAX_PERCENT = 1.35;
const MAX_TICK_GAIN_PERCENT = 2.2;
const MAX_TICK_DROP_PERCENT = -3.5;
const PRICE_FLOOR_MULTIPLIER = 0.25;
const PRICE_HARD_CEILING_MULTIPLIER = 6;

const BOT_TRADERS = [
  { name: 'Atlas Quant', cash_balance: 180000, style: 'momentum' },
  { name: 'Harbor Fund', cash_balance: 160000, style: 'value' },
  { name: 'Nova Desk', cash_balance: 140000, style: 'support' },
  { name: 'Pulse Capital', cash_balance: 150000, style: 'active' },
  { name: 'Cedar Algo', cash_balance: 130000, style: 'balanced' },
  { name: 'Orion Market', cash_balance: 170000, style: 'contrarian' },
];

const EVENT_TEMPLATES = [
  {
    title: 'AI regulation relief',
    description: 'Regulators delay strict AI licensing rules, lifting the AI sector.',
    scope: 'sector' as const,
    target_sector: 'AI',
    price_impact_percent: 7,
  },
  {
    title: 'Energy storage shortage',
    description: 'Battery supply pressure hurts renewable energy margins.',
    scope: 'sector' as const,
    target_sector: 'Energy',
    price_impact_percent: -5,
  },
  {
    title: 'Clinical trial surprise',
    description: 'A healthcare trial result changes investor appetite overnight.',
    scope: 'sector' as const,
    target_sector: 'Healthcare',
    price_impact_percent: 6,
  },
  {
    title: 'Streaming platform partnership',
    description: 'A large distribution deal boosts gaming revenue expectations.',
    scope: 'sector' as const,
    target_sector: 'Gaming',
    price_impact_percent: 8,
  },
  {
    title: 'Market risk-off session',
    description: 'Players rotate into cash after a simulated macro shock.',
    scope: 'global' as const,
    price_impact_percent: -3,
  },
  {
    title: 'Drone inspection contracts',
    description: 'Infrastructure companies expand drone inspections across remote sites.',
    scope: 'sector' as const,
    target_sector: 'Aerospace',
    price_impact_percent: 6,
  },
  {
    title: 'Fresh food supply deal',
    description: 'Retailers sign new local farming supply agreements.',
    scope: 'sector' as const,
    target_sector: 'Agriculture',
    price_impact_percent: 4,
  },
  {
    title: 'Merchant fraud scare',
    description: 'Payment providers face scrutiny after a simulated fraud wave.',
    scope: 'sector' as const,
    target_sector: 'Fintech',
    price_impact_percent: -6,
  },
  {
    title: 'School platform rollout',
    description: 'Districts expand digital learning subscriptions for the next term.',
    scope: 'sector' as const,
    target_sector: 'Education',
    price_impact_percent: 5,
  },
  {
    title: 'Security breach cycle',
    description: 'Companies increase security budgets after several fictional attacks.',
    scope: 'sector' as const,
    target_sector: 'Cybersecurity',
    price_impact_percent: 7,
  },
  {
    title: 'Port congestion easing',
    description: 'Shipping schedules normalize and logistics margins improve.',
    scope: 'sector' as const,
    target_sector: 'Logistics',
    price_impact_percent: 4,
  },
  {
    title: 'Raw material price jump',
    description: 'Manufacturing input costs rise and pressure near-term margins.',
    scope: 'sector' as const,
    target_sector: 'Manufacturing',
    price_impact_percent: -4,
  },
  {
    title: 'Consumer demand pop',
    description: 'Premium retail demand improves after a strong simulated holiday cycle.',
    scope: 'sector' as const,
    target_sector: 'Consumer',
    price_impact_percent: 5,
  },
];

const STARTER_OFFERS = [
  {
    sku: 'starter_cash_5k',
    title: 'Starter Cash Boost',
    description: 'Adds simulated cash for faster early experimentation.',
    type: 'starter_cash' as const,
    price_usd: 2.99,
    cash_reward: 5000,
    premium_credit_reward: 0,
  },
  {
    sku: 'premium_credits_100',
    title: '100 Premium Credits',
    description: 'Credits for optional cosmetics, boosts, and season features.',
    type: 'premium_credits' as const,
    price_usd: 4.99,
    cash_reward: 0,
    premium_credit_reward: 100,
  },
];

const NEWS_TEMPLATES = [
  {
    slug: 'border-war-risk',
    title: 'Border war risk rises near energy corridor',
    summary:
      'Military tension around a key transit route could raise fuel costs and pressure logistics companies. Defense and cybersecurity names may attract defensive buying.',
    category: 'War',
    target_sector: 'Logistics',
    expected_impact_percent: -7,
    probability_percent: 62,
    severity: 'high',
    days_from_now: 1,
  },
  {
    slug: 'regional-defense-alliance',
    title: 'Regional defense alliance expected to sign drone procurement pact',
    summary:
      'Several governments are discussing a joint inspection-drone program. AeroVista Drones is seen as a likely supplier if the pact is signed.',
    category: 'State Alliance',
    target_symbol: 'AERO',
    expected_impact_percent: 9,
    probability_percent: 71,
    severity: 'high',
    days_from_now: 2,
  },
  {
    slug: 'drought-warning',
    title: 'Drought warning threatens traditional agriculture supply',
    summary:
      'Weather agencies warn that a dry season may hurt open-field supply. Vertical farming companies could benefit while food costs rise.',
    category: 'Drought',
    target_sector: 'Agriculture',
    expected_impact_percent: 6,
    probability_percent: 67,
    severity: 'medium',
    days_from_now: 3,
  },
  {
    slug: 'education-tax-plan',
    title: 'Education tax plan heads to committee vote',
    summary:
      'A proposed digital-learning tax credit may increase school software spending next quarter.',
    category: 'Tax Policy',
    target_sector: 'Education',
    expected_impact_percent: 5,
    probability_percent: 58,
    severity: 'medium',
    days_from_now: 4,
  },
  {
    slug: 'cyber-attack-wave',
    title: 'Cyber attack wave prompts emergency security budgets',
    summary:
      'A series of fictional attacks on utilities may push companies toward endpoint protection and incident response vendors.',
    category: 'Security',
    target_sector: 'Cybersecurity',
    expected_impact_percent: 8,
    probability_percent: 76,
    severity: 'high',
    days_from_now: 1,
  },
  {
    slug: 'green-subsidy-review',
    title: 'Green subsidy review may extend solar credits',
    summary:
      'Lawmakers are reviewing a longer subsidy window for microgrid and battery projects. Solara Grid would benefit from longer support.',
    category: 'Government Support',
    target_symbol: 'SOLR',
    expected_impact_percent: 7,
    probability_percent: 64,
    severity: 'medium',
    days_from_now: 5,
  },
  {
    slug: 'chip-shortage',
    title: 'Sensor chip shortage may delay robotics shipments',
    summary:
      'Component suppliers warn of limited machine-vision chip inventory. Robotics firms could face margin pressure if supply does not improve.',
    category: 'Supply Chain',
    target_sector: 'AI',
    expected_impact_percent: -5,
    probability_percent: 55,
    severity: 'medium',
    days_from_now: 2,
  },
  {
    slug: 'consumer-alliance',
    title: 'Consumer brands form retail data alliance',
    summary:
      'A coalition of premium brands plans shared customer analytics. Retail marketplaces may gain better targeting and lower acquisition costs.',
    category: 'Business Alliance',
    target_sector: 'Consumer',
    expected_impact_percent: 4,
    probability_percent: 52,
    severity: 'low',
    days_from_now: 6,
  },
];

@Injectable()
export class MarketService implements OnModuleInit, OnModuleDestroy {
  private readonly autoTickIntervalMs = Number(process.env.MARKET_TICK_MS ?? 20000);
  private autoTickTimer?: NodeJS.Timeout;
  private isAutoTickRunning = false;
  private lastAutoTickAt?: Date;
  private nextAutoTickAt?: Date;

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
  ) {}

  async onModuleInit() {
    await this.seedGameData();
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

    const offersCount = await this.offersRepository.count();
    if (offersCount === 0) {
      await this.offersRepository.save(
        STARTER_OFFERS.map((offer) => this.offersRepository.create(offer)),
      );
    }

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
    for (const companySeed of STARTER_COMPANIES) {
      const existing = await this.companiesRepository.findOne({
        where: { symbol: companySeed.symbol },
      });

      if (!existing) {
        await this.companiesRepository.save(this.companiesRepository.create(companySeed));
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
        price: normalizedPrice.price,
        previous_price: normalizedPrice.previous_price,
      });
    }
  }

  private async seedMarketNews() {
    const now = Date.now();

    for (const newsSeed of NEWS_TEMPLATES) {
      const existing = await this.newsRepository.findOne({
        where: { slug: newsSeed.slug },
      });
      const scheduledAt = new Date(now + newsSeed.days_from_now * 24 * 60 * 60 * 1000);
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
    for (const bot of BOT_TRADERS) {
      const existing = await this.playersRepository.findOne({
        where: { display_name: bot.name },
      });

      if (!existing) {
        await this.playersRepository.save(
          this.playersRepository.create({
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
    return this.eventsRepository.find({ order: { created_at: 'DESC' }, take: 25 });
  }

  getMarketNews() {
    return this.newsRepository.find({
      where: { status: 'scheduled' },
      order: { scheduled_at: 'ASC' },
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
    const [companies, trades] = await Promise.all([
      this.companiesRepository.find({ where: { is_active: true }, order: { symbol: 'ASC' } }),
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
      const companyTrades = trades.filter((trade) => trade.symbol === company.symbol);
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
        .sort((first, second) => first.created_at.getTime() - second.created_at.getTime())
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
      display_name: dto.display_name.trim(),
      cash_balance: 10000,
      premium_credits: 0,
    });

    return this.playersRepository.save(player);
  }

  async getPortfolio(playerId: number) {
    const player = await this.findPlayer(playerId);
    const holdings = await this.holdingsRepository.find({ where: { player_id: playerId } });
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

    const trade = await this.executeTrade(player, company, dto.side as TradeSide, quantity);

    return {
      trade,
      portfolio: await this.getPortfolio(player.id),
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
      player.cash_balance = this.roundMoney(Number(player.cash_balance) - totalCost);
    } else {
      if (Number(holding.quantity) < quantity) {
        if (!strict) return null;
        throw new BadRequestException('Not enough tokens to sell');
      }

      holding.quantity = Number(holding.quantity) - quantity;
      player.cash_balance = this.roundMoney(Number(player.cash_balance) + grossValue - fee);
      if (Number(holding.quantity) === 0) {
        holding.average_cost = 0;
      }
    }

    await this.playersRepository.save(player);
    await this.holdingsRepository.save(holding);

    return this.tradesRepository.save(
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
  }

  async runMarketTick() {
    const companies = await this.companiesRepository.find({ where: { is_active: true } });
    if (companies.length === 0) {
      throw new BadRequestException('Seed companies before running a market tick');
    }

    const botTrades = await this.runBotTradingRound(companies);
    const demandTrades = await this.getRecentDemandTrades(botTrades);
    const eventTemplate = this.pickEventTemplate();
    const event = await this.eventsRepository.save(
      this.eventsRepository.create({
        ...eventTemplate,
        duration_ticks: 1,
      }),
    );

    const updatedCompanies = companies.map((company) => {
      const eventImpact = this.getEventImpact(company, event) * EVENT_IMPACT_TICK_SCALE;
      const demandImpact = this.getDemandImpactPercent(company, demandTrades);
      const supportEffect = this.getSupportPriceEffect(company, eventImpact);
      const noise = this.randomBetween(
        supportEffect.downsideVolatility,
        supportEffect.upsideVolatility,
      );
      const priceDrift = this.getPriceDriftPercent(company);
      const rawImpactPercent =
        eventImpact + demandImpact + noise + supportEffect.growthBias + priceDrift;
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

    return {
      event,
      companies: updatedCompanies.map((company) => ({
        symbol: company.symbol,
        name: company.name,
        previous_price: Number(company.previous_price),
        price: Number(company.price),
        demand_impact_percent: this.roundPercent(this.getDemandImpactPercent(company, demandTrades)),
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
      const botConfig = BOT_TRADERS[Math.floor(Math.random() * BOT_TRADERS.length)];
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
      where: BOT_TRADERS.map((bot) => ({ display_name: bot.name })),
    });
  }

  private pickBotCompany(companies: SimCompany[], style: string) {
    const sorted = [...companies].sort((first, second) => {
      const firstChange = this.getCompanyChangePercent(first);
      const secondChange = this.getCompanyChangePercent(second);
      const firstRatio = Number(first.price) / this.getFairPrice(first);
      const secondRatio = Number(second.price) / this.getFairPrice(second);

      if (style === 'momentum') return secondChange - firstChange;
      if (style === 'value') return firstRatio - secondRatio;
      if (style === 'support') return this.getSupportScore(second) - this.getSupportScore(first);
      if (style === 'contrarian') return firstChange - secondChange;
      return Math.random() - 0.5;
    });

    const preferredPool = sorted.slice(0, Math.min(5, sorted.length));
    return preferredPool[Math.floor(Math.random() * preferredPool.length)] || companies[0];
  }

  private async pickBotSide(bot: SimPlayer, company: SimCompany, style: string): Promise<TradeSide> {
    const holding = await this.holdingsRepository.findOne({
      where: { player_id: bot.id, company_id: company.id },
    });
    const hasInventory = Number(holding?.quantity || 0) > 0.2;
    const change = this.getCompanyChangePercent(company);
    const ratio = Number(company.price) / this.getFairPrice(company);
    const supportScore = this.getSupportScore(company);
    let buyProbability = 0.54;

    if (style === 'momentum') buyProbability += change > 0 ? 0.18 : -0.1;
    if (style === 'value') buyProbability += ratio < 0.95 ? 0.24 : ratio > 1.18 ? -0.24 : 0;
    if (style === 'support') buyProbability += supportScore / 520;
    if (style === 'contrarian') buyProbability += change < -0.5 ? 0.24 : change > 1.1 ? -0.18 : 0;
    if (style === 'active') buyProbability += this.randomBetween(-0.16, 0.16);

    buyProbability = this.clamp(buyProbability, 0.22, 0.82);
    if (!hasInventory) {
      return 'buy';
    }

    return Math.random() < buyProbability ? 'buy' : 'sell';
  }

  private async getBotQuantity(bot: SimPlayer, company: SimCompany, side: TradeSide) {
    const price = Number(company.price);
    if (!price || !Number.isFinite(price)) {
      return 0;
    }

    if (side === 'sell') {
      const holding = await this.holdingsRepository.findOne({
        where: { player_id: bot.id, company_id: company.id },
      });
      const inventory = Number(holding?.quantity || 0);
      return this.roundQuantity(Math.min(inventory, inventory * this.randomBetween(0.18, 0.55)));
    }

    const spend = Math.min(Number(bot.cash_balance) * 0.08, this.randomBetween(450, 3200));
    return this.roundQuantity(this.clamp(spend / price, 0.1, 42));
  }

  private async getRecentDemandTrades(botTrades: Trade[]) {
    const since = new Date(Date.now() - Math.max(this.autoTickIntervalMs * 2, 45000));
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
    const companyTrades = trades.filter((trade) => trade.symbol === company.symbol);
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
    const activityBoost = Math.min(1, totalValue / Math.max(5000, Number(company.market_cap) / 100000));
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

  getMonetizationOffers() {
    return this.offersRepository.find({
      where: { is_active: true },
      order: { price_usd: 'ASC' },
    });
  }

  async purchaseOffer(dto: PurchaseOfferDto) {
    const player = await this.findPlayer(Number(dto.player_id));
    await this.ensureVerifiedAccountPlayer(player);
    const offer = await this.offersRepository.findOne({
      where: { id: Number(dto.offer_id), is_active: true },
    });

    if (!offer) {
      throw new NotFoundException('Offer was not found');
    }

    player.cash_balance = this.roundMoney(
      Number(player.cash_balance) + Number(offer.cash_reward),
    );
    player.premium_credits = this.roundMoney(
      Number(player.premium_credits) + Number(offer.premium_credit_reward),
    );
    await this.playersRepository.save(player);

    const purchase = await this.purchasesRepository.save(
      this.purchasesRepository.create({
        player_id: player.id,
        offer_id: offer.id,
        sku: offer.sku,
        price_usd: Number(offer.price_usd),
        status: 'simulated',
      }),
    );

    return {
      purchase,
      player,
      note: 'This is a simulated purchase record. Connect a payment provider before charging real money.',
    };
  }

  async purchaseCustomCash(dto: { player_id: number; cash_amount: number }) {
    const player = await this.findPlayer(Number(dto.player_id));
    await this.ensureVerifiedAccountPlayer(player);
    const cashAmount = Number(dto.cash_amount);

    if (!Number.isFinite(cashAmount) || cashAmount < 1000) {
      throw new BadRequestException('cash_amount must be at least 1000');
    }

    if (cashAmount > 100000000) {
      throw new BadRequestException('cash_amount is too large for one purchase');
    }

    const roundedCash = this.roundMoney(cashAmount);
    const priceUsd = this.roundMoney(Math.max(0.99, roundedCash * 0.0006));

    player.cash_balance = this.roundMoney(Number(player.cash_balance) + roundedCash);
    await this.playersRepository.save(player);

    const purchase = await this.purchasesRepository.save(
      this.purchasesRepository.create({
        player_id: player.id,
        offer_id: 0,
        sku: `custom_cash_${Math.round(roundedCash)}`,
        price_usd: priceUsd,
        status: 'simulated',
      }),
    );

    return {
      purchase,
      player,
      cash_reward: roundedCash,
      note: 'This is a simulated currency purchase. Connect a payment provider before charging real money.',
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

    return player;
  }

  private async ensureVerifiedAccountPlayer(player: SimPlayer) {
    if (!player.user_id) {
      throw new BadRequestException('Register and verify email before buying currency');
    }

    const user = await this.usersRepository.findOneBy({ id: player.user_id });
    if (!user?.email_verified) {
      throw new BadRequestException('Verify email before buying currency');
    }
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
    const companies = await this.companiesRepository.find({ where: { is_active: true } });
    if (companies.length === 0) {
      return;
    }

    const bot = await this.playersRepository.save(
      this.playersRepository.create({
        display_name: 'Market Maker',
        cash_balance: 100000,
        premium_credits: 0,
      }),
    );

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
          created_at: new Date(Date.now() - (index + company.id * 7) * 60 * 60 * 1000),
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

    if (company.government_support_type && company.government_support_type !== 'none') {
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
    return EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  }

  private getEventImpact(company: SimCompany, event: EconomicEvent) {
    if (event.scope === 'global') {
      return Number(event.price_impact_percent);
    }

    if (event.scope === 'sector' && event.target_sector === company.sector) {
      return Number(event.price_impact_percent);
    }

    if (event.scope === 'company' && event.target_symbol === company.symbol) {
      return Number(event.price_impact_percent);
    }

    return 0;
  }

  private normalizeSeedPrice(
    existing: SimCompany,
    companySeed: (typeof STARTER_COMPANIES)[number],
  ) {
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
    if (!previousPrice || !Number.isFinite(previousPrice) || !Number.isFinite(currentPrice)) {
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
    return Number(STARTER_COMPANY_BY_SYMBOL.get(company.symbol)?.price || company.price || 0);
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
