import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity'; // Store 엔티티 경로를 확인하세요
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [
        TypeOrmModule.forFeature([Store]), // Store 엔티티 등록
  ],
  providers: [StoreService],          // StoreService 등록
  controllers: [StoreController],     // StoreController 등록
  exports: [StoreService],            // 다른 모듈에서 사용하려면 export
})


export class StoreModule {}