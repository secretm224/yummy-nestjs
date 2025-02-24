import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
    constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}

    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });

        console.log(`Kafka 메시지 전송 완료:`, message);
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('Kafka Producer Disconnected');
    }
}
