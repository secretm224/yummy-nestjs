import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZeroPossibleService {
    constructor(
        @InjectRepository(ZeroPossibleMarket)
		private zeroPossibleRepository: Repository<ZeroPossibleMarket>,
    ) {}

    // ZeroPossibleMarket 객체를 DB 에 저장해주기 위함.
    async create(store: Partial<Store>): Promise<ZeroPossibleMarket | null> {
        
        const isBpay = store.is_beefulpay;

        if (isBpay) {
            
            const zeroPossible = this.zeroPossibleRepository.create(
                {
                    seq: store.seq,
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