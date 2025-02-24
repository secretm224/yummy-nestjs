import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClusterProvider } from './redis.provider';
import { RedisController } from './redis.controller';

@Module({
    controllers: [RedisController],
    providers: [RedisService, RedisClusterProvider],
    exports: [RedisService],
})
export class RedisModule {}
