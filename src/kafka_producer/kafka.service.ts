import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'kafkajs';

import * as fs from 'fs';
import * as path from 'path';


/* Singletone 으로 관리 */
@Injectable()
export class KafkaService implements OnModuleDestroy {
    constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}
    
    async sendMessage(topic: string, message: any) {
        
        const data = JSON.stringify(message);
        
        await this.producer.send({
            topic,
            messages: [{ value: data }],
        });

        console.log(`Kafka 메시지 전송 완료:`, message);

        this.logToFile(data);
    }

    private logToFile(message: string): void 
    {
        const logFilePath = path.join(__dirname, `../../logs/${new Date().toDateString()}.log`);
        const titmestamp = new Date().toISOString();
        const logMessage = `[${titmestamp}] - ${message}\n`;

        if (!fs.existsSync(path.dirname(logFilePath))) {
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        }

        fs.appendFileSync(logFilePath, logMessage, 'utf8');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('Kafka Producer Disconnected');
    }
}
