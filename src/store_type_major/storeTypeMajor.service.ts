import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTypeMajor } from 'src/entities/store_type_major.entity';
import { DataSource, Repository } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';


@Injectable()
export class StoreTypeMajorService{
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(StoreTypeMajor)
        private storeTypeMajorRepository: Repository<StoreTypeMajor>,
        private readonly loggerService: KafkaService
    ) {}


    async findAll(): Promise<StoreTypeMajor[]> {

        const entities = await this.storeTypeMajorRepository.createQueryBuilder('store_type_major')
            .select(
                [
                    'store_type_major.major_type',
                    'store_type_major.type_name'
                ]
            )
            .getMany();

        console.log(entities);
        
        const storeTypeMajorData = entities.map((storeType) => ({
            ...storeType
        }));
        
        return storeTypeMajorData;
    }
}