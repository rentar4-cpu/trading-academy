import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PurchaseOfferDto } from './dto/purchase-offer.dto';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post('seed')
  seed() {
    return this.marketService.seedGameData();
  }

  @Get('companies')
  getCompanies() {
    return this.marketService.getCompanies();
  }

  @Get('events')
  getEvents() {
    return this.marketService.getEvents();
  }

  @Get('news')
  getMarketNews() {
    return this.marketService.getMarketNews();
  }

  @Get('history')
  getMarketHistory() {
    return this.marketService.getMarketHistory();
  }

  @Get('clock')
  getMarketClock() {
    return this.marketService.getMarketClock();
  }

  @Post('players')
  createPlayer(@Body() body: CreatePlayerDto) {
    return this.marketService.createPlayer(body);
  }

  @Get('players/:id/portfolio')
  getPortfolio(@Param('id', ParseIntPipe) id: number) {
    return this.marketService.getPortfolio(id);
  }

  @Post('orders')
  placeOrder(@Body() body: PlaceOrderDto) {
    return this.marketService.placeOrder(body);
  }

  @Post('tick')
  runMarketTick() {
    return this.marketService.runMarketTick();
  }

  @Get('monetization/offers')
  getOffers() {
    return this.marketService.getMonetizationOffers();
  }

  @Post('monetization/purchases')
  purchaseOffer(@Body() body: PurchaseOfferDto) {
    return this.marketService.purchaseOffer(body);
  }

  @Post('sessions/start')
  startSession(@Body() body: { player_id: number; starter_sku?: string }) {
    return this.marketService.startSessionWithTokens(body);
  }

  @Get('players/:id/progression')
  getProgression(@Param('id', ParseIntPipe) id: number) {
    return this.marketService.getProgression(id);
  }

  @Get('analytics/first-session')
  getFirstSessionMetrics() {
    return this.marketService.getFirstSessionMetrics();
  }
}
