import { Provider } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

export const KafkaProvider: Provider = {
    provide: 'KAFKA_PRODUCER', /* 해당 토큰으로 Kafka Producer를 싱글톤으로 관리 */
    useFactory: async (configService: ConfigService) => {
        const kafkaBrokers = configService.get<string>('KAFKA_BROKER')?.split(',') || [];
        const kafkaClientId = configService.get<string>('KAFKA_CLIENT_ID') || 'nestjs-kafka-producer';

        const kafka = new Kafka({
            clientId: kafkaClientId,
            brokers: kafkaBrokers,
        });

        const producer: Producer = kafka.producer();
        await producer.connect(); /* 싱글톤이므로 생성 시 한 번만 연결 */ 

        console.log('✅ Kafka Producer Connected');
        console.log('🔹 Kafka Producer Instance:', producer); /* 싱글톤인지 확인하는 방법 */
        
        return producer;
    },
    inject: [ConfigService],
};
