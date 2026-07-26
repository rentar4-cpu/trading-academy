import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AchievementProgress } from './entities/achievement-progress.entity';
import { DailyQuestProgress } from './entities/daily-quest-progress.entity';
import { EconomicEvent } from './entities/economic-event.entity';
import { Holding } from './entities/holding.entity';
import { MarketNews } from './entities/market-news.entity';
import { MonetizationOffer } from './entities/monetization-offer.entity';
import { Purchase } from './entities/purchase.entity';
import { SimCompany } from './entities/sim-company.entity';
import { SimPlayer } from './entities/sim-player.entity';
import { Trade } from './entities/trade.entity';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EconomicEvent,
      AchievementProgress,
      DailyQuestProgress,
      Holding,
      MarketNews,
      MonetizationOffer,
      Purchase,
      SimCompany,
      SimPlayer,
      Trade,
      User,
    ]),
  ],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
