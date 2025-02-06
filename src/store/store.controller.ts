import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';
import { LoggerService } from '../kafka/logger.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get('/all')
  async findAll(): Promise<Store[]> {
    this.SendLog({
      reg_dt: new Date(),
      reg_id: 'secretm',
      message: 'findAlltest4',
    });

    return this.storeService.findAll();
  }

  @Post('/add')
  async create(@Body() store: Partial<Store>): Promise<Store | null> {
    store.reg_dt = new Date();
    store.reg_id = 'secretm';

    this.SendLog(store); //비동기 kafka로그 기록

    return this.storeService.create(store);
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
