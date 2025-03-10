import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ZeroPossibleService {
    constructor(
        @InjectRepository(ZeroPossibleMarket)
		private zeroPossibleRepository: Repository<ZeroPossibleMarket>,
    ) {}
    
    
    /**
     * ZeroPossibleMarket 객체를 DB 에 저장해주는 함수
     * 
     * @param store 
     * @param queryRunner 
     * @returns 
     */
    async create(store: Partial<Store>,  queryRunner: QueryRunner): Promise<ZeroPossibleMarket | null> {
        
        const zeroPossible = queryRunner.manager.create(
            ZeroPossibleMarket,
            {
                seq: store.seq,
                name: store.name,
                use_yn: 'Y',
                reg_dt: store.reg_dt,
                reg_id: store.reg_id
            }
        );
        
        return queryRunner.manager.save(ZeroPossibleMarket, zeroPossible);
    }
}