import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Util } from '../util/datautil';


@Injectable()
export class StoreLocationInfoService {
    constructor(
        @InjectRepository(StoreLocationInfoTbl)
		private storeLocationRepository: Repository<StoreLocationInfoTbl>,
    ) {}

    /**
     * ZeroPossibleMarket 객체를 DB 에 저장해주는 함수
     * 
     * @param store_db 
     * @param store 
     * @param queryRunner 
     * @returns 
     */
    async create(storeDb: Partial<Store>, store: Partial<Store>, queryRunner?: QueryRunner): Promise<StoreLocationInfoTbl> {
        
        // const storeLocationInfo = queryRunner?.manager.create(
        //     StoreLocationInfoTbl,
        //     {
        //         seq: storeDb.seq,
        //         address: store.address,
        //         lat: store.lat,
        //         lng: store.lng,
        //         reg_dt: store.reg_dt,
        //         chg_dt: store.chg_dt,
        //         reg_id: store.reg_id,
        //         chg_id: store.chg_id,
        //         location_city: store.location_city,
        //         location_county: store.location_county,
        //         location_district: store.location_district
        //     }
        // );
        
        //return queryRunner?.manager.save(StoreLocationInfoTbl, storeLocationInfo);

        const storeLocationData = Util.filterUndefined({
            seq: storeDb.seq,
            address: store.address,
            lat: store.lat,
            lng: store.lng,
            reg_dt: store.reg_dt,
            chg_dt: store.chg_dt,
            reg_id: store.reg_id,
            chg_id: store.chg_id,
            location_city: store.location_city,
            location_county: store.location_county,
            location_district: store.location_district,
          });
      
          let storeLocationInfo: StoreLocationInfoTbl;
      
          if (queryRunner) {
            storeLocationInfo = queryRunner.manager.create(StoreLocationInfoTbl, storeLocationData);
            return await queryRunner.manager.save(StoreLocationInfoTbl, storeLocationInfo);
          } else {
            storeLocationInfo = this.storeLocationRepository.create(storeLocationData);
            return await this.storeLocationRepository.save(storeLocationInfo);
          }
    }
}