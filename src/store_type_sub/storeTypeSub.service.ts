

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';
import { DataSource, Repository } from 'typeorm';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { RedisService } from 'src/redis/redis.service';
import { GenericRepository } from 'src/generic_repository/generic.repository';
import { StoreTypeSubDTO } from './dto/StoreTypeSubDTO';


@Injectable()
export class StoreTypeSubService{
    private readonly storeTypeSubRepository: GenericRepository<StoreTypeSub>;
    private readonly cacheKey = 'categories:sub';
    
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly loggerService: KafkaService,
        private readonly redisService: RedisService
    ) {
        this.storeTypeSubRepository = new GenericRepository<StoreTypeSub>(this.dataSource, StoreTypeSub);
    }

    async SendLog(message: any) {
		try {
			await this.loggerService.sendMessage('yummy-store', message);
		} catch (error) {
			console.log('faile to log to kafka', error);
		}
	}

    /**
     * 대분류 코드에 매칭되는 소분류 정보를 반환해주는 함수
     *  
     * @param major_num - 대분류 코드 번호
     * @returns 
     */
    async findSubTypes(major_num: string): Promise<StoreTypeSubDTO[] | null> {
        
        /* 숫자가 들어오는지 체크해줌 */
        if ( !(/^\d+$/.test(major_num)) ) {
            this.SendLog("[StoreTypeSubService->findSubTypes()] Only numbers are allowed for parameters.");
            return null;
        }

        const cache_key_prefix = `${this.cacheKey}:${major_num}`;
        const data: string | null = await this.redisService.getValue(cache_key_prefix);
        let storeTypeSubDTOs: StoreTypeSubDTO[] = [];

        if (data && data.length != 0) {
            /* 레디스에 데이터가 있는 경우 */
            try {
                const parsedDatas = JSON.parse(data) as StoreTypeSubDTO[];
                storeTypeSubDTOs = parsedDatas.map((item) => StoreTypeSubDTO.fromJSON(item));

                return storeTypeSubDTOs
            } catch(err) {
                await this.SendLog(err);
                return storeTypeSubDTOs;
            }

        } else {

            /* 레디스에 데이터가 없는 경우 -> DB 에서 데이터를 찾아와준다. */
            const entities = await this.storeTypeSubRepository
                .getQueryBuilder('store_type_sub')
                .innerJoinAndSelect(
                    'store_type_sub.storeTypeMajor',
                    'store_type_major'
                )
                .select([
                    'store_type_sub.sub_type',
                    'store_type_sub.type_name'
                ])
                .where('store_type_major.major_type = :major_type', {major_type : major_num})
                .getMany();
            
            storeTypeSubDTOs = entities.map(entity => new StoreTypeSubDTO(entity.sub_type, entity.major_type, entity.type_name));    
        }
        
        return storeTypeSubDTOs;
    }
}