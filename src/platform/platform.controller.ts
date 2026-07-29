import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { PlatformActivityDto } from './platform.service';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('games')
  getGames() {
    return this.platformService.getGames();
  }

  @Get('users/:id/profile')
  getProfile(@Param('id') id: string) {
    return this.platformService.getPlatformProfile(Number(id));
  }

  @Get('users/:id/wallet')
  getWallet(@Param('id') id: string) {
    return this.platformService.getWallet(Number(id));
  }

  @Get('users/:id/stats')
  getStats(@Param('id') id: string) {
    return this.platformService.getStats(Number(id));
  }

  @Get('users/:id/achievements')
  getAchievements(@Param('id') id: string) {
    return this.platformService.getAchievements(Number(id));
  }

  @Get('users/:id/friends')
  getFriends(@Param('id') id: string) {
    return this.platformService.getFriends(Number(id));
  }

  @Post('users/:id/friends')
  addFriend(
    @Param('id') id: string,
    @Body('friend_user_id') friendUserId: number,
  ) {
    return this.platformService.addFriend(Number(id), Number(friendUserId));
  }

  @Post('users/:id/games/:gameId/install')
  installGame(@Param('id') id: string, @Param('gameId') gameId: string) {
    return this.platformService.installGame(Number(id), gameId);
  }

  @Post('users/:id/activity')
  recordActivity(@Param('id') id: string, @Body() body: PlatformActivityDto) {
    return this.platformService.recordActivity(Number(id), body);
  }

  @Get('store/offers')
  getStoreOffers() {
    return this.platformService.getStoreOffers();
  }
}
