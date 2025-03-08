import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreTypeMajor } from 'src/entities/store_type_major.entity';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';
import { KafkaModule } from 'src/kafka_producer/kafka.module';
import { StoreTypeMajorService } from './storeTypeMajor.service';
import { StoreTypeMajorController } from './storeTypeMajor.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([Store, StoreTypeMajor]), // orm 엔티티 등록
    KafkaModule,
  ],
  providers: [StoreTypeMajorService], // 등록
  controllers: [StoreTypeMajorController], // Controller 등록
  exports: [StoreTypeMajorService, TypeOrmModule], // 다른 모듈에서 사용하려면 export
})
export class StoreTypeMajorModule {}