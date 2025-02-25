import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KafkaService } from 'src/kafka_producer/kafka.service';

@Injectable()
export class RequestIpMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestIpMiddleware.name);

    constructor(private readonly kafkaService: KafkaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        /* Express 4/5 및 최신 Node.js에서 권장되는 방식 */ 
        const ip = req.socket.remoteAddress || req.ip;
        const url = req.originalUrl;
        const forwardedIp = Array.isArray(req.headers['x-forwarded-for'])
            ? req.headers['x-forwarded-for'][0]
            : req.headers['x-forwarded-for'];

        this.logger.log(`Request from IP: ${forwardedIp || ip}, URL: ${url}`);
        
        await this.kafkaService.sendMessage('yummy-store', `Request from IP: ${forwardedIp || ip}, URL: ${url}`);

        next();
    }
}
