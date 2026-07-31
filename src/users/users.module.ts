import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimPlayer } from '../market/entities/sim-player.entity';
import { UserConsent } from './user-consent.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, SimPlayer, UserConsent])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
