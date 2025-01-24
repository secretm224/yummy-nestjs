import { Inject, Injectable, OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class LoggerService implements OnModuleInit, OnModuleDestroy {
    private admin;

    constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {
        const kafka = new Kafka({
            brokers: ['221.149.34.65:2029', '221.149.34.65:2030', '221.149.34.65:2031'],
        });
        this.admin = kafka.admin();
    }

    async onModuleInit() {
        
        await this.client.connect();
        await this.admin.connect();

        try {
            await this.admin.createTopics({
                topics: [
                    {
                        topic: 'yummy-store',
                        numPartitions: 3,
                        replicationFactor: 2,
                    },
                ],
            });

            console.log('Kafka topic "store" 생성 성공');

        } catch (error) {
            console.error('store Kafka topic 생성 실패 메세지:', error);
        }
        await this.admin.disconnect();
    }

    async onModuleDestroy() {
        await this.client.close();
        await this.admin.disconnect();
    }

    
    async logTokafla(topic: string, message: any) {
        try {
          console.log('log start kafka', message);
          await this.client.emit(topic, message);
          console.log('log end kafka', message);
        } catch (error) {
            console.log('failed to log to kafka', error);
        }
    }
  
}