import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { LoggerService } from '../kafka/logger.service';
import { ZeroPossibleService } from 'src/zero_possible_market/zeroPossible.service';

@Controller('store')
export class StoreController {
	constructor(
		private readonly storeService: StoreService,
		private readonly zeroPossibleService: ZeroPossibleService,
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
	async create(@Body() store: Partial<Store>): Promise<Store | null> {
		store.reg_dt = new Date();
		store.reg_id = 'seunghwan';
		
		try {
			const saveStore = await this.storeService.create(store); // store 생성

			if (saveStore != null) {
				const _zeroPossible = await this.zeroPossibleService.create(saveStore); // zeroPossible 생성
			}
			
			return saveStore;
		} catch(err) {
			// 로깅해야함.
			return null;
		}
	}
  // @Post('/add')
  // async create(@Body() Partial<Store>): Promise<Store | null> {

  //   // const storeDate: Partial<Store> = {
  //   //   ...body,
  //   //   reg_dt: new Date(),
  //   //   reg_id: 'secretm'
  //   // }

  //   //const isBpay = body.is_beefulpay;
    
  //   //store.
  //   //this.SendLog(store); //비동기 kafka로그 기록
  //   //this.SendLog(zero_possible); //비동기 kafka로그 기록

  //   return this.storeService.create(storeDate, isBpay);
  // }

	@Post('/update')
	async update(@Body() store: Partial<Store>): Promise<Store | null> {
		return this.storeService.update(store);
	}

  	// LoggerService
	async SendLog(message: any) {
		try {
			console.log('log start kafka', message);
			await this.loggerService.logTokafka('yummy-store', message);
			console.log('log end kafka', message);
		} catch (error) {
			console.log('faile to log to kafka', error);
		}
	}
}
