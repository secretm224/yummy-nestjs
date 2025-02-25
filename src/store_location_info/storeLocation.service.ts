import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreLocationInfoService {
    constructor(
        @InjectRepository(StoreLocationInfoTbl)
		private storeLocationRepository: Repository<StoreLocationInfoTbl>,
    ) {}

    // ZeroPossibleMarket 객체를 DB 에 저장해주기 위함.
    async create(store_db: Partial<Store>, store: Partial<Store>): Promise<StoreLocationInfoTbl> {
        
        const storeLocationInfo = this.storeLocationRepository.create(
            {
                seq: store_db.seq,
                address: store.address,
                lat: store.lat,
                lng: store.lng,
                reg_dt: store.reg_dt,
                chg_dt: store.chg_dt,
                reg_id: store.reg_id,
                chg_id: store.chg_id,
                location_city: store.location_city,
                location_county: store.location_county,
                location_district: store.location_district
            }
        );
        
        return this.storeLocationRepository.save(storeLocationInfo);
    }
}