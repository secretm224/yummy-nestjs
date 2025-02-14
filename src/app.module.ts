import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StoreModule } from './store/store.module'; //store module 추가
import { KafkaModule } from './kafka/kafka.module'; //kafka module 추가
import { SearchModule } from './elasticsearch/search.module'; // Elasticsearch module 추가
import { LoggerService } from './kafka/logger.service'; //kafka logger service 추가
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
      //envFilePath: '.env.local',//local
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
    SearchModule
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
