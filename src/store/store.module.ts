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
import { StoreTypeLinkService } from 'src/store_type_link_tbl/storeTypeLink.service';
import { StoreTypeLinkTbl } from 'src/entities/store_type_link_tbl.entity';
import { StoreResolver } from './store.resolver';


@Module({
  imports: [
    TypeOrmModule.forFeature([Store, ZeroPossibleMarket, StoreLocationInfoTbl, StoreTypeLinkTbl]), /* orm 엔티티 등록 */ 
    KafkaModule,
  ],
  providers: [StoreService, ZeroPossibleService, StoreLocationInfoService, StoreTypeLinkService, StoreResolver], /* 사용할 서비스 등록 */
  controllers: [StoreController], /* Controller 등록 */ 
  exports: [StoreService,StoreLocationInfoService], /* 다른모듈에서 사용하기 위한 Export */
})
export class StoreModule {}