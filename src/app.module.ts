import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StoreModule } from './store/store.module'; 
// import { KafkaModule } from './kafka/kafka.module'; /* kafka module */
import { KafkaModule } from './kafka_producer/kafka.module';
import { SearchModule } from './elasticsearch/search.module'; /* Elasticsearch module */
import { LoggerService } from './kafka/logger.service'; 
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module'; /* auth module */
import { RedisModule } from './redis/redis.module'; /* redis module */
import { RequestIpMiddleware } from './middlware/request-ip.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
			isGlobal: true,
		}),

		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'public'),
			serveRoot: '/public',
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return typeOrmConfig(configService);
			},
		}),
		StoreModule,
		KafkaModule,
		SearchModule,
		AuthModule,
		RedisModule
	],
	controllers: [AppController, AuthController],
	providers: [AppService, LoggerService],
})

/* Ip 추적을 위함 */
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RequestIpMiddleware)
			.forRoutes('*');
				
	}
}
