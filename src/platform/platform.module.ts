import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementProgress } from '../market/entities/achievement-progress.entity';
import { MonetizationOffer } from '../market/entities/monetization-offer.entity';
import { User } from '../users/user.entity';
import { AchievementEvent } from './entities/achievement-event.entity';
import { DevLogEntry } from './entities/dev-log-entry.entity';
import { EarlyAccessSignup } from './entities/early-access-signup.entity';
import { PlatformGame } from './entities/platform-game.entity';
import { ProductUpdate } from './entities/product-update.entity';
import { ReferralInvite } from './entities/referral-invite.entity';
import { ShareEvent } from './entities/share-event.entity';
import { TesterFeedback } from './entities/tester-feedback.entity';
import { UserFriend } from './entities/user-friend.entity';
import { UserGameProfile } from './entities/user-game-profile.entity';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementEvent,
      AchievementProgress,
      DevLogEntry,
      EarlyAccessSignup,
      MonetizationOffer,
      PlatformGame,
      ProductUpdate,
      ReferralInvite,
      ShareEvent,
      TesterFeedback,
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
