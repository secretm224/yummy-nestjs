import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { Repository, DataSource } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import {Util} from '../util/datautil';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StoreService {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(Store)
		private storeRepository: Repository<Store>,
		private readonly loggerService: KafkaService
	) {}

	/* Deprecated */
	async findAll(): Promise<Store[]> {

		const entities = await this.storeRepository.createQueryBuilder('store')
			.innerJoinAndSelect(
				'store.store_location_info_tbl',
				'store_location_info_tbl'
			)
			.leftJoinAndSelect(
				'store.zero_possible_market', 
				'zero_possible_market',
				'zero_possible_market.use_yn = :useYn',
        		{ useYn: 'Y' }
			)
			.select(
				[
					'store.name',
					'store.type',
					'zero_possible_market.seq',
					'store_location_info_tbl.address',
					'store_location_info_tbl.lat',
					'store_location_info_tbl.lng',
				]
			)
			.where('store.use_yn = :use_yn', {use_yn: 'Y'})
			.getMany();
		
		const storeData = entities.map((store) => ({
			...store,
			is_beefulpay: store.zero_possible_market ? true : false,
			address: store.store_location_info_tbl.address,
			lat: store.store_location_info_tbl.lat,
			lng: store.store_location_info_tbl.lng
		}));
		
		return storeData;
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

		store.use_yn = 'Y';
		const newStore = this.storeRepository.create(store);

		return this.storeRepository.save(newStore);
	}

	async update(store: Partial<Store>): Promise<Store | null> {
		if (!store.name) {
			throw new Error('store name is required for update');
		}

		const existingStore = await this.findByName(store.name);
		if (existingStore) {
			existingStore.lat = store.lat ?? existingStore.lat; // 기본값으로 기존 lat 사용
			existingStore.lng = store.lng ?? existingStore.lng; // 기본값으로 기존 lng 사용
			existingStore.chg_dt = Util.GetUtcDate();
			existingStore.chg_id = 'system';
			
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
}
