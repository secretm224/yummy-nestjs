import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StoreModule } from './store/store.module'; 
import { KafkaModule } from './kafka_producer/kafka.module'; /* kafka module */
import { KafkaService } from './kafka_producer/kafka.service';
import { SearchModule } from './elasticsearch/search.module'; /* Elasticsearch module */ 
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module'; /* auth module */
import { RedisModule } from './redis/redis.module'; /* redis module */
import { RequestIpMiddleware } from './middlware/request-ip.middleware';
import { KafkaProvider } from './kafka_producer/kafka.provider';
import { AdminModule } from './admin/admin.module';
import { StoreTypeMajor } from './entities/store_type_major.entity';
import { StoreTypeMajorModule } from './store_type_major/storeTypeMajor.module';
import { StoreTypeMajorService } from './store_type_major/storeTypeMajor.service';
import { StoreTypeSubModule } from './store_type_sub/storeTypeSub.module';
import { StoreTypeLinkModule } from './store_type_link_tbl/storeTypeLink.module';

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
				const baseConfig = typeOrmConfig(configService);
				return {
                    ...baseConfig,
                    timezone: 'Z', /* MySQL의 경우 UTC로 강제 저장 */ 
                };
				//return typeOrmConfig(configService);
			},
		}),
		StoreModule,
		KafkaModule,
		SearchModule,
		AuthModule,
		RedisModule,
		AdminModule,
		StoreTypeMajorModule,
		StoreTypeSubModule,
		StoreTypeLinkModule
	],
	controllers: [AppController, AuthController],
	providers: [AppService, StoreTypeMajorService, KafkaProvider],
})

/* Ip 추적을 위함 */
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RequestIpMiddleware)
			.forRoutes('*');
				
	}
}
