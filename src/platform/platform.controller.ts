import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type {
  EarlyAccessDto,
  PlatformActivityDto,
  ReferralInviteDto,
  ShareDto,
} from './platform.service';
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

  @Post('launch/early-access')
  joinEarlyAccess(@Body() body: EarlyAccessDto) {
    return this.platformService.joinEarlyAccess(body);
  }

  @Post('launch/referrals')
  createReferralInvite(@Body() body: ReferralInviteDto) {
    return this.platformService.createReferralInvite(body);
  }

  @Get('launch/referrals/:code')
  getReferralInvite(@Param('code') code: string) {
    return this.platformService.getReferralInvite(code);
  }

  @Get('devlog')
  getDevLog() {
    return this.platformService.getDevLog();
  }

  @Get('whats-new')
  getWhatsNew() {
    return this.platformService.getWhatsNew();
  }

  @Post('share')
  recordShare(@Body() body: ShareDto) {
    return this.platformService.recordShare(body);
  }
}
