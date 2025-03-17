import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { StoreTypeMajor } from 'src/entities/store_type_major.entity';
import { DataSource } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { GenericRepository } from 'src/generic_repository/generic.repository';
import { RedisService } from 'src/redis/redis.service';
import { StoreTypeMajorDTO } from './dto/StoreTypeMajorDTO';

@Injectable()
export class StoreTypeMajorService{
    private readonly storeTypeMajorRepository: GenericRepository<StoreTypeMajor>;
    private readonly cacheKey = 'categories:main';

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly loggerService: KafkaService,
        private readonly redisService: RedisService
    ) {
        this.storeTypeMajorRepository = new GenericRepository<StoreTypeMajor>(this.dataSource, StoreTypeMajor);
    }
    
    /**
     * Kafka 에 메시지를 로깅해주는 함수
     * 
     * @param message 
     */
    async SendLog(message: any) {
        await this.loggerService.sendMessage('yummy-store', message);
	}
    
    /**
     * 상품 대분류 데이터를 반환해주는 함수
     * Redis 에서 먼저 읽어주고, 문제가 발생한 경우에 rdb에서 데이터를 읽어준다.
     * 
     * @returns 
     */
    async findAll(): Promise<StoreTypeMajorDTO[]> {
        
        const data: string | null = await this.redisService.getValue(this.cacheKey);
        let storeTypesDTOs: StoreTypeMajorDTO[] = [];
        
        if (data && data.length != 0) {
            /* 레디스에 데이터가 있는 경우 */
            try {
                const parsedDatas = JSON.parse(data) as StoreTypeMajorDTO[];
                storeTypesDTOs = parsedDatas.map((item) => StoreTypeMajorDTO.fromJSON(item));

                return storeTypesDTOs;
            } catch(err) {
                await this.SendLog(err);
                return storeTypesDTOs;
            }
        } else {
            /* 레디스에 데이터가 없는 경우 -> DB 에서 데이터를 찾아옴 */
            const entities = await this.storeTypeMajorRepository
                .getQueryBuilder('store_type_major')
                .select(
                    [
                        'store_type_major.major_type',
                        'store_type_major.type_name'
                    ]
                )
                .getMany();
                
            storeTypesDTOs = entities.map(entity => new StoreTypeMajorDTO(entity.major_type, entity.type_name)); 
            
            return storeTypesDTOs;
        }
    }
}