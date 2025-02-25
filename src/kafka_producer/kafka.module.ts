import { Module } from '@nestjs/common';
import { KafkaProvider } from './kafka.provider';
import { KafkaService } from './kafka.service';

@Module({
    providers: [KafkaProvider, KafkaService],
    exports: [KafkaService], /* 다른 모듈에서도 사용할 수 있도록 exports */ 
})
export class KafkaModule {}
