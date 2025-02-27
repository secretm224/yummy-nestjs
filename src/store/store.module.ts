import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity'; // Store 엔티티 경로를 확인하세요
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity'; // Store 엔티티 경로를 확인하세요
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { KafkaModule } from 'src/kafka_producer/kafka.module';
import { ZeroPossibleService } from 'src/zero_possible_market/zeroPossible.service';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { StoreLocationInfoService } from 'src/store_location_info/storeLocation.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Store, ZeroPossibleMarket, StoreLocationInfoTbl]), // orm 엔티티 등록
    KafkaModule,
  ],
  providers: [StoreService, ZeroPossibleService, StoreLocationInfoService], // StoreService 등록
  controllers: [StoreController], // StoreController 등록
  exports: [StoreService], // 다른 모듈에서 사용하려면 export
})
export class StoreModule {}