import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLUSTER') private readonly redis: Redis.Cluster) {}

    async setValue(key: string, value: string): Promise<void> {
        await this.redis.set(key, value);
    }

    async getValue(key: string): Promise<string | null> {
        console.log("TEST!!!");

        let test = await this.redis.get(key);

        return await test;
    }

    async deleteValue(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
