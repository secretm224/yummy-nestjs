

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';
import { DataSource, Repository } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { isNumber } from 'class-validator';


@Injectable()
export class StoreTypeSubService{
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(StoreTypeSub)
        private storeTypeSubRepository: Repository<StoreTypeSub>,
        private readonly loggerService: KafkaService
    ) {}
    
    async findSubTypes(major_num: string): Promise<StoreTypeSub[] | null> {

        console.log(major_num);
    
        if ( !(/^\d+$/.test(major_num)) ) {
            return null;
        }

        console.log('??');

        const entities = await this.storeTypeSubRepository.createQueryBuilder('store_type_sub')
            .innerJoinAndSelect(
                'store_type_sub.storeTypeMajor',
                'store_type_major'
            )
            .select(
                [
                    'store_type_sub.sub_type',
                    'store_type_sub.type_name'
                ]
            )
            .where('store_type_major.major_type = :major_type', {major_type : major_num})
            .getMany();
        
        console.log(entities);
        
        const sotreTypeSubData = entities.map((storeSub) => ({
            ...storeSub
        }));

        return sotreTypeSubData;
    }
}