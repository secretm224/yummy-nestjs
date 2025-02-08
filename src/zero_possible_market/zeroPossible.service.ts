import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ZeroPossibleService {
    constructor(
        @InjectRepository(ZeroPossibleMarket)
		private zeroPossibleRepository: Repository<ZeroPossibleMarket>,
    ) {}

    async create(store: Partial<Store>): Promise<ZeroPossibleMarket | null> {
        
        const isBpay = store.is_beefulpay;

        if (isBpay) {
            
            console.log(store.seq);
            
            const zeroPossible = this.zeroPossibleRepository.create(
                {
                    store_pk: store.seq,
                    name: store.name,
                    use_yn: 'Y',
                    reg_dt: store.reg_dt,
                    reg_id: store.reg_id
                }
            );
            
            return this.zeroPossibleRepository.save(zeroPossible);
        } else {
            return null;
        }
    }
}