import { TradeSide } from '../entities/trade.entity';

export class PlaceOrderDto {
  player_id: number;
  symbol: string;
  side: TradeSide;
  quantity: number;
}
