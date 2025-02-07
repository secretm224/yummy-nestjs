import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { Repository, DataSource } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StoreService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(ZeroPossibleMarket)
    private zeroPossibleMarket: Repository<ZeroPossibleMarket>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  async findByName(name: string): Promise<Store | null> {
    return this.storeRepository.findOneBy({ name }) || null;
  }

  async create(store: Partial<Store>, isBpay: boolean): Promise<Store> {
    if (!store.name) {
      throw new Error('store name is required for create');
    }

    if (!store.lat || !store.lng) {
      throw new Error('lat , lng is required');
    }
    
    /* 
      트랜잭션을 사용해서 한번에 데이터를 넣어주도록 함
      - store, zero_possible_market 테이블 
    */
    return await this.dataSource.transaction(async (manager) => {
		const storeData = manager.create(Store, store);
		const savedStore = await manager.save(storeData);
		//await this.storeRepository.save(store);

		if (isBpay) {
			const zero_possible_data = manager.create(
				ZeroPossibleMarket,
				{
					store_pk: store.seq,
					name: storeData.name,
					use_yn: 'Y',
					reg_dt: store.reg_dt,
					reg_id: store.reg_id
				} 
			)

			await manager.save(zero_possible_data);
		}


		return savedStore;
    })
    
    //this.logTofile(`store created: ${JSON.stringify(store)}`);
    //return null;
    // return savedStore;
  }

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
    //console.log('save log test secretm'); 터미널에 남겨진다.

    const logFilePath = path.join(__dirname, '../../logs/create_store.log');
    const titmestamp = new Date().toISOString();
    const logMessage = `[${titmestamp}] - ${message}\n`;

    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    fs.appendFileSync(logFilePath, logMessage, 'utf8');
  }
}
