import { Inject, Injectable } from '@nestjs/common';
import { StoreTypeMajorDTO } from './dto/StoreTypeMajorDTO';
import * as Redis from 'ioredis';
import { KafkaService } from 'src/kafka_producer/kafka.service';

@Injectable()
export class RedisService {
    constructor(
        @Inject('REDIS_CLUSTER') private readonly redis: Redis.Cluster,
        private readonly loggerService: KafkaService
    ) {}

    async SendLog(message: any) {
		try {
			await this.loggerService.sendMessage('yummy-store', message);
		} catch (error) {
			console.log('faile to log to kafka', error);
		}
	}

    async setValue(key: string, value: string): Promise<void> {
        await this.redis.set(key, value);
    }

    async getValue(key: string): Promise<string | null> {
        const test = await this.redis.get(key);

        return test;
    }

    async deleteValue(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async getMajorCategories(): Promise<StoreTypeMajorDTO[]> {

        const data = await this.redis.get('categories')

        console.log(data);

        if (!data) {
            return [];
        }

        try {
            const parsedData = JSON.parse(data as string);
            const test = parsedData.categories.map(StoreTypeMajorDTO.fromJSON);

            console.log(test);

            return test;
        } catch(err) {
            this.SendLog(err);
            return [];
        }
    }
}
