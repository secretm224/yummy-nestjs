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

    async update(store: Partial<Store>, queryRunner?: QueryRunner): Promise<StoreLocationInfoTbl|null>{

      if(store?.seq){
        const exists_addr = await this.storeLocationRepository.findOneBy({ seq: store.seq });
        if(exists_addr){
          exists_addr.lat = store.lat ?? exists_addr?.lat;
          exists_addr.lng = store.lng ?? exists_addr?.lng;
          exists_addr.address = store.address ?? exists_addr?.address;
          exists_addr.chg_dt = Util.GetUtcDate();
          //exists_addr.chg_id = "storelocaton>update"; 컬럼 X

          await this.storeLocationRepository.update(
                                                    { seq: store.seq },
                                                    {
                                                      lat: exists_addr.lat,
                                                      lng: exists_addr.lng,
                                                      chg_dt: exists_addr.chg_dt,
                                                      //chg_id: exists_addr.chg_id,
                                                    },
                                                  );

        }
        return await this.storeLocationRepository.findOneBy({ seq: store.seq });
      }

      return null;
    }


}