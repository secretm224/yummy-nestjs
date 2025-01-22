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

     async create(store: Partial<Store>): Promise<Store> {
        return this.storeRepository.save(store);
     }
}
