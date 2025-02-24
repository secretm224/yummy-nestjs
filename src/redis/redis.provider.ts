import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisClusterProvider: Provider = {
    provide: 'REDIS_CLUSTER',
    useFactory: (configService: ConfigService) => {
        const hosts = configService.get<string>('REDIS_CLUSTER_HOSTS');
        const password = configService.get<string>('REDIS_PASSWORD');
        const useTLS = configService.get<string>('REDIS_TLS_ENABLED') === 'true';

        if (!hosts) {
            throw new Error('REDIS_CLUSTER_HOSTS is not defined in .env');
        }
        
        const nodes = hosts.split(',').map((host) => {
            const [hostname, port] = host.split(':');
            return {
                host: hostname,
                port: Number(port),
                tls: useTLS ? {} : undefined, /* TLS 설정 적용 */ 
            };
        });

        const cluster = new Redis.Cluster(nodes, {
            redisOptions: {
            password,},
        });

        cluster.on('error', (err) => console.error('Redis Cluster Error:', err));

        console.log('Redis Cluster Connected');
        return cluster;
    },
    inject: [ConfigService],
};
