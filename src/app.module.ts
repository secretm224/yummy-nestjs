import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';

import { typeOrmConfig } from '../config/database.config'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//import { Store } from './entities/store.entity';
// import { StoreService } from './store/store.service';
// import { StoreController } from './store/store.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',                    // 데이터베이스 타입
//       host: '221.149.34.65',            // MySQL 서버 주소
//       port: 3306,                       // MySQL 포트 (기본값: 3306)
//       username: 'secretm',              // MySQL 사용자 이름
//       password: 'dkfqkcjsrnr1!',        // MySQL 비밀번호
//       database: 'alba_test_karina',     // 생성한 데이터베이스 이름
//       //entities: [Store], // 고정
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,                // 애플리케이션 실행 시 스키마 동기화 (개발 중에만 true)
//     }),
//     StoreModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
  
// })
// export class AppModule {}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      //envFilePath: '.env.local',//local
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), // 📌 현재 프로젝트 루트의 public 폴더 사용
      serveRoot: '/public', // 📌 클라이언트에서 접근할 URL 경로
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return typeOrmConfig(configService); 
      },
    }),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}