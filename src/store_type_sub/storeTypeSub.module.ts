import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from 'src/kafka_producer/kafka.module';
import { StoreTypeSubService } from './storeTypeSub.service';
import { StroeTypeSubController } from './storeTypeSub.controller';
import { StoreTypeSub } from 'src/entities/store_type_sub.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([StoreTypeSub]), /*  orm 엔티티 등록 */
    KafkaModule,
  ],
  providers: [StoreTypeSubService], /* 서비스 등록 */ 
  controllers: [StroeTypeSubController], /* Controller 등록 */ 
  exports: [StoreTypeSubService, TypeOrmModule], /* 다른 모듈에서 사용할 수 있도록 export */ 
})
export class StoreTypeSubModule {}