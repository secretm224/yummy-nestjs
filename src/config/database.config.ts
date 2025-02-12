import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: false,
    dropSchema: false,
    migrationsRun: true, // 애플리케이션 실행 시 자동 마이그레이션 실행
    migrations: [__dirname + '/../migrations/*.{ts,js}'], // 마이그레이션 파일 경로
    entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')], // 📌 빌드 후에도 정상 동작하도록 설정
  };
};
