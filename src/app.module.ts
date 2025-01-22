import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';

//import { Store } from './entities/store.entity';
// import { StoreService } from './store/store.service';
// import { StoreController } from './store/store.controller';

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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,                // 애플리케이션 실행 시 스키마 동기화 (개발 중에만 true)
    }),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
