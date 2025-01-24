import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerService } from './logger.service'; // ✅ 추가

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['221.149.34.65:2029','221.149.34.65:2030','221.149.34.65:2031'],
                    },
                    consumer: {
                        groupId: 'yummy-store-consumer',  // ✅ 그룹 ID 추가
                    },
                    producer: {
                        allowAutoTopicCreation: true,  // ✅ 자동 생성 허용
                    },
                },
            },
        ]),
    ],
    providers: [LoggerService],  // LoggerService를 추가
    exports: [ClientsModule, LoggerService],  //  LoggerService도 exports
})
export class KafkaModule {}