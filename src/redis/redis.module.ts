import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClusterProvider } from './redis.provider';
import { RedisController } from './redis.controller';
import { KafkaModule } from 'src/kafka_producer/kafka.module';

@Module({
    imports: [KafkaModule],
    controllers: [RedisController],
    providers: [RedisService, RedisClusterProvider],
    exports: [RedisService],
})
export class RedisModule {}
