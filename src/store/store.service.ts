import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {

    constructor(
        @InjectRepository(Store)
        private storeRepository: Repository<Store>,
     ) {}
    
     async findAll(): Promise<Store[]> {
        return this.storeRepository.find();
     }

     async findByName(name: string): Promise<Store | null> {
        return this.storeRepository.findOneBy({ name }) || null;
     }

     async create(store: Partial<Store>): Promise<Store> {
       return this.storeRepository.save(store);
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
            existingStore.chg_id = 'secretm224';
        
          await this.storeRepository.update({ name: store.name }, {
            lat: existingStore.lat,
            lng: existingStore.lng,
            chg_dt: existingStore.chg_dt,
            chg_id: existingStore.chg_id,
          });
    
          return this.storeRepository.findOneBy({ name: store.name });
        }
        
          return null;
    }
}
