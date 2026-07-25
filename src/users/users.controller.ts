import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(
    @Body()
    body: {
      email: string;
      password: string;
      display_name?: string;
      guest_player_id?: number;
    },
  ) {
    return this.usersService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { email: string; code: string }) {
    return this.usersService.verifyEmail(body);
  }

  @Post('ad-reward')
  claimAdReward(@Body() body: { player_id: number }) {
    return this.usersService.claimAdReward(Number(body.player_id));
  }

  @Post('guest')
  createGuest(@Body() body: { display_name?: string }) {
    return this.usersService.createGuest(body.display_name);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
