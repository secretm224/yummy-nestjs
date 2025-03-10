
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { StoreTypeLinkTbl } from 'src/entities/store_type_link_tbl.entity';
import { Store } from 'src/entities/store.entity';


@Injectable()
export class StoreTypeLinkService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(StoreTypeLinkTbl)
        private storeTypeLinkRepository: Repository<StoreTypeLinkTbl>,
        private readonly loggerService: KafkaService
    ) {}

    /**
     * store_type_link_tbl 테이블에 데이터를 저장해주는 함수
     * 
     * @param store 
     * @param queryRunner 
     * @returns 
     */
    async create(store: Partial<Store>, queryRunner: QueryRunner): Promise<StoreTypeLinkTbl | null> {

        const storeTypeLink = queryRunner.manager.create(
            StoreTypeLinkTbl,
            {
                sub_type: store.sub_type,
                seq: store.seq,
                reg_dt: store.reg_dt,
                reg_id: store.reg_id,
                chg_dt: store.chg_dt,
                chg_id: store.chg_id
            }
        );  
        
        return queryRunner.manager.save(StoreTypeLinkTbl, storeTypeLink);
    }
    
}