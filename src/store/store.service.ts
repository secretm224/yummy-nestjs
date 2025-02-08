import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { Repository, DataSource } from 'typeorm';
import { LoggerService } from '../kafka/logger.service';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StoreService {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(Store)
		private storeRepository: Repository<Store>,
		private readonly loggerService: LoggerService
	) {}

	async findAll(): Promise<Store[]> {
		return this.storeRepository.find();
	}

	async findByName(name: string): Promise<Store | null> {
		return await this.storeRepository.findOneBy({ name }) || null; // 에러 나서 await 붙여둠 나중에는 빼도 됨.
	}
	
	async create(store: Partial<Store>): Promise<Store | null> {
		if (!store.name) {
			throw new Error('store name is required for create');
		}

		if (!store.lat || !store.lng) {
			throw new Error('lat , lng is required');
		}

		const newStore =  this.storeRepository.create(store);
		//const saveStore = await this.storeRepository.save(newStore);

		return this.storeRepository.save(newStore);
	}

	//this.logTofile(`store created: ${JSON.stringify(store)}`);
	//return null;
	// return savedStore;

	async update(store: Partial<Store>): Promise<Store | null> {
		if (!store.name) {
			throw new Error('store name is required for update');
		}

		const existingStore = await this.findByName(store.name);
		if (existingStore) {
			existingStore.lat = store.lat ?? existingStore.lat; // 기본값으로 기존 lat 사용
			existingStore.lng = store.lng ?? existingStore.lng; // 기본값으로 기존 lng 사용
			existingStore.chg_dt = new Date();
			existingStore.chg_id = 'secretm';

			await this.storeRepository.update(
			{ name: store.name },
			{
				lat: existingStore.lat,
				lng: existingStore.lng,
				chg_dt: existingStore.chg_dt,
				chg_id: existingStore.chg_id,
			},
			);

			return this.storeRepository.findOneBy({ name: store.name });
		}

		return null;
	}

	private logTofile(message: string): void {

		const logFilePath = path.join(__dirname, '../../logs/create_store.log');
		const titmestamp = new Date().toISOString();
		const logMessage = `[${titmestamp}] - ${message}\n`;

		if (!fs.existsSync(path.dirname(logFilePath))) {
			fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
		}

		fs.appendFileSync(logFilePath, logMessage, 'utf8');
	}
	
	/**
	 * 제네릭한 저장 함수 (중복 제거 + 로깅 포함)
	 * 
	 * @param manager 
	 * @param entityClass 
	 * @param data 
	 * @returns 
	 */
	// private async saveEntityWithLog<T>(manager: any, entityClass: { new(): T }, data: Partial<T>): Promise<T> {
	// 	const entity = manager.create(entityClass, data);
	// 	const savedEntity = await manager.save(entity);
		
	// 	// Kafka 로그 전송
	// 	this.loggerService.logTokafka('entity-created', {
	// 	  entity: entityClass.name,
	// 	  data: savedEntity
	// 	});
		
	// 	return savedEntity;
	// }
}
