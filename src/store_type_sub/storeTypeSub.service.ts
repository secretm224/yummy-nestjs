

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';
import { DataSource, Repository } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';


@Injectable()
export class StoreTypeSubService{
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(StoreTypeSub)
        private storeTypeSubRepository: Repository<StoreTypeSub>,
        private readonly loggerService: KafkaService
    ) {}
    
    /**
     * 대분류 코드에 매칭되는 소분류 정보를 반환해주는 함수
     *  
     * @param major_num - 대분류 코드 번호
     * @returns 
     */
    async findSubTypes(major_num: string): Promise<StoreTypeSub[] | null> {
    
        if ( !(/^\d+$/.test(major_num)) ) {
            return null;
        }

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
        
        const sotreTypeSubData = entities.map((storeSub) => ({
            ...storeSub
        }));

        return sotreTypeSubData;
    }
}