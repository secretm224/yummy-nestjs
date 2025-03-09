import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreTypeMajor } from 'src/entities/store_type_major.entity';
import { KafkaModule } from 'src/kafka_producer/kafka.module';
import { StoreTypeSubService } from './storeTypeSub.service';
import { StroeTypeSubController } from './storeTypeSub.controller';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([StoreTypeSub, StoreTypeMajor]), // orm 엔티티 등록
    KafkaModule,
  ],
  providers: [StoreTypeSubService], // 등록
  controllers: [StroeTypeSubController], // Controller 등록
  exports: [StoreTypeSubService, TypeOrmModule], // 다른 모듈에서 사용하려면 export
})
export class StoreTypeSubModule {}