import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerService } from './logger.service'; 

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
                        groupId: 'yummy-store-consumer',  
                    },
                    producer: {
                        allowAutoTopicCreation: true, 
                    },
                },
            },
        ]),
    ],
    providers: [LoggerService], 
    exports: [ClientsModule, LoggerService], 
})
export class KafkaModule {}