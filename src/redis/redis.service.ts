import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { KafkaService } from 'src/kafka_producer/kafka.service';

@Injectable()
export class RedisService {
    constructor(
        @Inject('REDIS_CLUSTER') private readonly redis: Redis.Cluster,
        private readonly loggerService: KafkaService
    ) {}

    async SendLog(message: any) {
        await this.loggerService.sendMessage('yummy-store', message);
	}

    async setValue(key: string, value: string): Promise<void> {
        await this.redis.set(key, value);
    }
    
    async getValue(key: string): Promise<string | null> {
        
        try {
            const value = await this.redis.get(key);
            
            return value;
        } catch(err) {
            this.SendLog(`[Error][RedisService][getValue] ${err}`);
            
            return null;
        }
    }

    async deleteValue(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
