import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementProgress } from '../market/entities/achievement-progress.entity';
import { MonetizationOffer } from '../market/entities/monetization-offer.entity';
import { User } from '../users/user.entity';
import { AchievementEvent } from './entities/achievement-event.entity';
import { PlatformGame } from './entities/platform-game.entity';
import { UserFriend } from './entities/user-friend.entity';
import { UserGameProfile } from './entities/user-game-profile.entity';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementEvent,
      AchievementProgress,
      MonetizationOffer,
      PlatformGame,
      User,
      UserFriend,
      UserGameProfile,
    ]),
  ],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
