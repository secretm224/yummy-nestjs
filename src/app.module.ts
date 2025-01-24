import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {join} from 'path';

import { StoreModule } from './store/store.module'; //store module 추가
import { KafkaModule } from './kafka/kafka.module'; //kafka module 추가
// import { LoggerService } from './kafka/logger.service'; //kafka logger service 추가

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',                    // 데이터베이스 타입
      host: '221.149.34.65',            // MySQL 서버 주소
      port: 3306,                       // MySQL 포트 (기본값: 3306)
      username: 'secretm',              // MySQL 사용자 이름
      password: 'dkfqkcjsrnr1!',        // MySQL 비밀번호
      database: 'alba_test_karina',     // 생성한 데이터베이스 이름
      //entities: [Store], // 고정
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,                // 애플리케이션 실행 시 스키마 동기화 (개발 중에만 true)
    }),
    StoreModule,
    KafkaModule,
  ],
  //controllers: [AppController,LoggerService],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
