import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerService } from './logger.service'; 


@Module({
    imports: [
        ConfigModule.forRoot({ 
            isGlobal: true,
            envFilePath:process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
            
        }),
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER.split(',') : [],
                    },
                    consumer: {
                        groupId: 'yummy-store-consumer',
                        sessionTimeout: 60000,  // ✅ 60초로 증가 (기존: 45초)
                        heartbeatInterval: 15000, // ✅ 15초 유지
                        rebalanceTimeout: 90000,  // ✅ 90초로 증가 (기존: 60초)
                        maxWaitTimeInMs: 5000, // 메시지를 기다리는 최대 시간 (기본값: 5000)  
                    },
                    producer: {
                        allowAutoTopicCreation: false, 
                    },
                },
            },
        ]),
    ],
    providers: [LoggerService], 
    exports: [ClientsModule, LoggerService], 
})
export class KafkaModule {}