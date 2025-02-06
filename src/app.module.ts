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
import { LoggerService } from './kafka/logger.service'; //kafka logger service 추가

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env' :'.env.production',
      //envFilePath: '.env.local',//local
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), // 📌 현재 프로젝트 루트의 public 폴더 사용
      serveRoot: '/public', // 📌 클라이언트에서 접근할 URL 경로
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      //inject: [ConfigService],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      useFactory: async (configService: ConfigService) => {
        return typeOrmConfig(configService); 
      },
    }),
    StoreModule,
    KafkaModule,
  ],
  //controllers: [AppController,LoggerService],
  controllers: [AppController],
  providers: [AppService,LoggerService],
})
export class AppModule {}