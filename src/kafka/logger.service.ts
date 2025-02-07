import { Inject, Injectable, OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class LoggerService implements OnModuleInit, OnModuleDestroy {
    private admin;
    private kafkaTopic: string; // .env 파일에서 불러올 토픽을 저장
    
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
            this.kafkaTopic = process.env.KAFKA_TOPIC || 'default-topic';
        } catch (error) {
            console.error('Kafka topic 생성 실패 메세지:', error);
        }
        await this.admin.disconnect();
    }

    async onModuleDestroy() {
        await this.client.close();
        await this.admin.disconnect();
    }

    
    async logTokafka(topic: string, message: any) {
        try {
          console.log('log start kafka', message);
          await this.client.emit(this.kafkaTopic, message);
          console.log('log end kafka', message);
        } catch (error) {
            console.log('failed to log to kafka', error);
        }
    }
  
}