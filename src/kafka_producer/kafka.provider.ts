import { Provider } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

export const KafkaProvider: Provider = {
    provide: 'KAFKA_PRODUCER',
    useFactory: async () => {
        const kafkaBrokers = process.env.KAFKA_BROKER?.split(',') || [];
        const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'nestjs-kafka-producer';

        const kafka = new Kafka({
            clientId: kafkaClientId,
            brokers: kafkaBrokers,
        });

        const producer: Producer = kafka.producer();
        await producer.connect(); /* ✅ 싱글톤이므로 생성 시 한 번만 연결 */ 

        console.log('✅ Kafka Producer Connected');

        return producer;
    },
};
