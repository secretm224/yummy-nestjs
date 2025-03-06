import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';
import { ZeroPossibleService } from 'src/zero_possible_market/zeroPossible.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { StoreLocationInfoService } from 'src/store_location_info/storeLocation.service';
import { Util } from '../util/datautil';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('store') 
@Controller('store')
export class StoreController {
	constructor(
		private readonly storeService: StoreService,
		private readonly zeroPossibleService: ZeroPossibleService,
		private readonly storeLocationInfoService: StoreLocationInfoService,
		private readonly loggerService: KafkaService,
	) {}

	@Get('/all')
	async findAll(): Promise<Store[]> {
		return this.storeService.findAll();
	}

	@ApiOperation({ summary: 'add store data', description: 'insert to store data' })
	@ApiResponse({ status: 200, description: 'return to success store data' })
	@Post('/add')
	async create(@Body() store: Partial<Store>): Promise<Store | null> {
		store.reg_dt = Util.GetUtcDate();
		store.reg_id = 'system';

		try {
			const saveStore = await this.storeService.create(store); // store 생성			

			if (saveStore != null) {
				
				await this.storeLocationInfoService.create(saveStore, store);
				saveStore.is_beefulpay = store.is_beefulpay ?? false;
        		const zeroPossible = await this.zeroPossibleService.create(saveStore); // zeroPossible 생성
				
				if (zeroPossible != null) {	//store와 zeroPossible 생성 성공시 로그 전송
					await this.SendLog(store); //비동기 kafka로그 기록
				}
			}
			
			return saveStore;
		} catch(err) {
      		await this.SendLog(err);
			return null;
		}

		//return null;
	}

	@Post('/update')
	async update(@Body() store: Partial<Store>): Promise<Store | null> {
		return this.storeService.update(store);
	}

  	/* LoggerService */ 
	async SendLog(message: any) {
		try {
			await this.loggerService.sendMessage('yummy-store', message);
		} catch (error) {
			console.log('faile to log to kafka', error);
		}
	}
}
