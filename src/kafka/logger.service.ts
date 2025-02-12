import { Inject, Injectable, OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class LoggerService implements OnModuleInit, OnModuleDestroy {
    private kafkaTopic: string; // .env 파일에서 불러올 토픽을 저장
    private kafka: Kafka;
    private admin: any;
    
    constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {
        const kafka_brokers = process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER.split(',') : [];
        console.log('kafka_brokers:', kafka_brokers);
        this.kafka = new Kafka({
            brokers:kafka_brokers ?? [],
        });
        
    }

    async onModuleInit() {
        //await this.client.connect();
        //await this.admin.connect();
        this.admin = this.kafka.admin();
        await this.admin.connect();
   
        try {   
            const results = await Promise.allSettled([
                this.client.connect(),
            ]);
        
            results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                
                console.log(`✅ Kafka Client 연결 성공`);
                this.kafkaTopic = process.env.KAFKA_TOPIC || 'default-topic';
            } else {
                console.error(`❌ Kafka Client 연결 실패`, result.reason);
            }
            });

            //this.kafkaTopic = process.env.KAFKA_TOPIC || 'default-topic';
        } catch (error) {
            console.error('Kafka topic 생성 실패 메세지:', error);
        }
        //await this.admin.disconnect();
    }

    async onModuleDestroy() {
        await this.client.close();
       // await this.admin.disconnect();
    }

    
    async logTokafka(topic: string, message: any) {
        try {
          console.log('log start kafka', message);
          
          if(!this.client){
            console.error('kafka client is null');
            return;
          }

           await this.client.emit(this.kafkaTopic, message);

          console.log('log end kafka', message);
        } catch (error) {
            console.log('failed to log to kafka', error);

            setTimeout(() => {
                this.logTokafka(topic, message);
                console.log('call retry to log to kafka');
            },1000);

            
        }
    }
  
}