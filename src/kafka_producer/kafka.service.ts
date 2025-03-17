import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'kafkajs';

import * as fs from 'fs';
import * as path from 'path';


/* Singletone 으로 관리 */
@Injectable()
export class KafkaService implements OnModuleDestroy {
    constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}
    
    /**
     * Kafka cluster 에 메시지를 로깅해주는 함수
     * 
     * @param topic 
     * @param message 
     */
    async sendMessage(topic: string, message: any) {
        
        try {
            
            const data = JSON.stringify(message);

            await this.producer.send({
                topic,
                messages: [{ value: data }],
            });

            this.logToFile(data);

        } catch(err) {
            this.logToFile(`Logging to Kafka failed.: ${err}`);
        }
    }
    
    /**
     * 서버 로컬 파일에 로깅을 해주는 함수
     * 
     * @param message 
     */
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
