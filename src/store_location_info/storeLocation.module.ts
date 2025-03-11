import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { StoreLocationInfoService } from './storeLocation.service';
import { StoreModule } from 'src/store/store.module';


@Module({
  imports: [
    StoreModule,
    TypeOrmModule.forFeature([StoreLocationInfoTbl]), // orm 엔티티 등록
  ],
  providers: [StoreLocationInfoService], // ZeroPossibleService 등록
  exports: [StoreLocationInfoService],   // 다른 모듈에서 사용하려면 export
})
export class StoreLocationInfoModule {}
