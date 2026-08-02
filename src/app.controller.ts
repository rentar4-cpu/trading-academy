import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/landing/', 302)
  openLanding() {
    return;
  }

  @Get('game')
  @Redirect('/game/index.html', 302)
  openGame() {
    return;
  }

  @Get('index.html')
  @Redirect('/game/index.html', 302)
  openGameIndex() {
    return;
  }
}
