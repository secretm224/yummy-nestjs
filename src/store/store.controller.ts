import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';
import { ZeroPossibleService } from 'src/zero_possible_market/zeroPossible.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { StoreLocationInfoService } from 'src/store_location_info/storeLocation.service';
import { Util } from '../util/datautil';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { StoreTypeLinkService } from 'src/store_type_link_tbl/storeTypeLink.service';


@ApiTags('store') 
@Controller('store')
export class StoreController {
	constructor(
		private readonly dataSource: DataSource,
		private readonly storeService: StoreService,
		private readonly zeroPossibleService: ZeroPossibleService,
		private readonly storeLocationInfoService: StoreLocationInfoService,
		private readonly storeTypeLinkService: StoreTypeLinkService,
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

		/* QueryRunner 생성 -> transaction 을 사용하기 위함 */
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction(); /* 트랜잭션 시작 */ 
		
		try {
			/* 1. store 테이블에 데이터 저장 */
			const saveStore = await this.storeService.create(store, queryRunner); /* store 생성 */ 			

			if (saveStore != null) {
				
				/* 2. store_location_info_tbl 테이블에 데이터 저장 */
				const storeLocation = await this.storeLocationInfoService.create(saveStore, store, queryRunner);
				if (storeLocation == null) throw new Error("Failed to create 'storeLocation' object")
				
				/* 3. zero_possible_market 테이블에 데이터 저장 */
				saveStore.is_beefulpay = store.is_beefulpay ?? false;
				if (saveStore.is_beefulpay) {
					const zeroPossible = await this.zeroPossibleService.create(saveStore, queryRunner);
					if (zeroPossible == null) throw new Error("Failed to create 'zeroPossible' object")
				}
				
				/* 4. store_type_link_tbl 테이블에 데이터를 저장 */
				saveStore.sub_type = store.sub_type ?? -1;
				const storeTypeLink = await this.storeTypeLinkService.create(saveStore, queryRunner);
				if (storeTypeLink == null || saveStore.sub_type == -1) throw new Error("Failed to create 'storeTypeLink' object");
				
				/* store와 storeLocation, zeroPossible 생성 성공시 로그 전송 */
				await this.SendLog(store); 

			} else {
				throw new Error("Failed to create 'saveStore' object")
			}
			
			/* 트랜잭션 커밋 */
			await queryRunner.commitTransaction();

			return saveStore;
		} catch(err) {
			/* 문제가 생겼을 시에 롤백 수행 */
			await queryRunner.rollbackTransaction(); 
      		await this.SendLog(err);
			return null;
		} finally {
			/* 트랜잭션 종료 */
			await queryRunner.release();
		}
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
