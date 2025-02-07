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
                        groupId: 'yummy-store-consumer-dev-1',  
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