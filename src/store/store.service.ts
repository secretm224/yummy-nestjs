import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { Util } from '../util/datautil';
import { StoreLocationInfoService } from 'src/store_location_info/storeLocation.service';


@Injectable()
export class StoreService {
	constructor(
		private readonly dataSource: DataSource,
		@InjectRepository(Store)
		private storeRepository: Repository<Store>,
		private readonly loggerService: KafkaService,
		private readonly storelocationservice:StoreLocationInfoService

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
					'store.use_yn',
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
			use_yn: store.use_yn,
			is_beefulpay: store.zero_possible_market ? true : false,
			address: store.store_location_info_tbl.address,
			lat: store.store_location_info_tbl.lat,
			lng: store.store_location_info_tbl.lng
		}));
		
		return storeData;
	}
	
	async findByName(name: string): Promise<Store | null> {
		const store = await this.storeRepository.findOne({
			where: { name },
			relations: ['store_location_info_tbl', 'zero_possible_market'],
		});

		if(!store){
			return null;
		}

		const storeData = {
			...store,
			use_yn: store.use_yn,
			is_beefulpay: store.zero_possible_market ? true : false,
			address: store.store_location_info_tbl.address,
			lat: store.store_location_info_tbl.lat,
			lng: store.store_location_info_tbl.lng
		};
		return storeData;
	}
	
	/**
	 * Store 테이블에 데이터를 저장해주는 함수
	 * 
	 * @param store 
	 * @param queryRunner 
	 * @returns 
	 */
	async create(store: Partial<Store>, queryRunner?: QueryRunner): Promise<Store | null> {

		if (!store.name) {
			throw new Error('store name is required for create');
		}

		if (!store.lat || !store.lng) {
			throw new Error('lat , lng is required');
		}

		store.use_yn = 'Y';
		const newStore = queryRunner
						? queryRunner.manager.create(Store, store)
						: this.storeRepository.create(store);

					return queryRunner
						? queryRunner.manager.save(Store, newStore)
						: this.storeRepository.save(newStore);
	}

	async update(store: Partial<Store>): Promise<Store | null> {
		if (!store.name) {
			throw new Error('store name is required for update');
		}

		const existingStore = await this.findByName(store.name);
		if(existingStore){
			existingStore.lat = store.lat ?? existingStore.lat;
			existingStore.lng = store.lng ?? existingStore.lng;
			existingStore.address = store.address ?? existingStore.address;

			const update_addr = await this.storelocationservice.update(existingStore);
			if(update_addr){
				return  await this.findByName(store.name);
			}else{
				return null;
			}
		}

		return null;
	}

}
