import { Inject, Injectable, OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class LoggerService implements OnModuleInit, OnModuleDestroy {
    private admin;

    constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {
        const kafka_brokers = process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER.split(',') : [];
        console.log('kafka_brokers:', kafka_brokers);
        const kafka = new Kafka({
            brokers:kafka_brokers ?? [],
        });
        this.admin = kafka.admin();
    }

    async onModuleInit() {
        
        await this.client.connect();
        await this.admin.connect();

        try {
            this.admin.hasTopic('store').then((topic) => { 
                topic ? console.log('yummuy-store Kafka topic 이미 존재') : console.log('yummuy-store Kafka topic 미존재');

            }).catch(async (error) => {
                console.log('topic 생성 에러 메세지:', error);
                console.log('store Kafka topic 생성 시작');
                await this.admin.createTopics({
                    topics: [
                        {
                            topic: 'yummuy-store',
                            numPartitions: 3,
                            replicationFactor: 2,
                        },
                    ],
                });
                console.log('Kafka topic "store" 생성 성공');
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