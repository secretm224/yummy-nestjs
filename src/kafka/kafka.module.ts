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
                        //groupId: 'yummy-store-consumer',
                        groupId: '',
                        // sessionTimeout: 45000,  // ✅ 60초로 증가 (기존: 45초)
                        // sessionTimeout: 80000,
                        // heartbeatInterval: 15000, // ✅ 15초 유지
                        // rebalanceTimeout: 60000,  // ✅ 90초로 증가 (기존: 60초)
                        // maxWaitTimeInMs: 5000, // 메시지를 기다리는 최대 시간 (기본값: 5000)  
                        sessionTimeout: 120000,  // 🔥 기존 80초 → 120초 (Kafka가 Consumer를 더 오래 기다려줌)
                        //heartbeatInterval: 45000, // 🔥 기존 30초 → 45초 (Coordinator가 Consumer 상태를 더 안정적으로 확인)
                        rebalanceTimeout: 180000,  // 🔥 기존 90초 → 180초 (리밸런싱 발생을 줄임)
                        retry: { retries: 20 },   // 🔄 Consumer 연결 실패 시 20번 재시도
                        maxInFlightRequests: 1,
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