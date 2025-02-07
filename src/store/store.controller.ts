import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { LoggerService } from '../kafka/logger.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get('/all')
  async findAll(): Promise<Store[]> {
    // this.SendLog({
    //   reg_dt: new Date(),
    //   reg_id: 'secretm',
    //   message: 'findAlltest4',
    // });

    return this.storeService.findAll();
  }

  @Post('/add')
  async create(@Body() body:any): Promise<Store | null> {

    const storeDate: Partial<Store> = {
      ...body,
      reg_dt: new Date(),
      reg_id: 'secretm'
    }

    const isBpay = body.is_beefulpay;
    
    //store.
    //this.SendLog(store); //비동기 kafka로그 기록
    //this.SendLog(zero_possible); //비동기 kafka로그 기록

    return this.storeService.create(storeDate, isBpay);
    //return null;
  }

  @Post('/update')
  async update(@Body() store: Partial<Store>): Promise<Store | null> {
    return this.storeService.update(store);
  }

  // LoggerService
  async SendLog(message: any) {
    try {
      console.log('log start kafla', message);
      await this.loggerService.logTokafla('yummy-store', message);
      console.log('log end kafla', message);
    } catch (error) {
      console.log('faile to log to kafka', error);
    }
  }
}
