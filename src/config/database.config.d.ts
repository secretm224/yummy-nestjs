import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export declare const typeOrmConfig: (configService: ConfigService) => TypeOrmModuleOptions;
