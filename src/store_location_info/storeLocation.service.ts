import { Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Util } from '../util/datautil';
import axios from 'axios';
import * as https from 'https';


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

    async GetLocationInfo(seq:number){
      if(seq){
        const location_info = await this.storeLocationRepository.findOneBy({seq:seq});
        if(location_info)
          return location_info;
      }else{
        return null;
      }
    }

    async SetLocationDetailInfo(locationInfo: Partial<StoreLocationInfoTbl>){
      if(locationInfo){
        const e_location = await this.storeLocationRepository.findOneBy({seq:locationInfo.seq});
        if(e_location){
          e_location.location_county = locationInfo.location_county ?? e_location.location_county;
          e_location.location_city = locationInfo.location_city ?? e_location.location_city;
          e_location.location_district = locationInfo.location_district ?? e_location.location_district;
          e_location.chg_dt = Util.GetUtcDate();

          await this.storeLocationRepository.update(
                                                      { seq: e_location.seq },
                                                      {
                                                        location_county: e_location.location_county,
                                                        location_city: e_location.location_city,
                                                        location_district: e_location.location_district,
                                                        chg_dt: e_location.chg_dt,
                                                      },
                                                    );

          return await this.storeLocationRepository.findOneBy({ seq: locationInfo.seq });
        }
      }

      return null;
    }

    // 	curl --location --request GET 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=분당구 불정로 6' \
// --header 'x-ncp-apigw-api-key-id: {API Key ID}' \
// --header 'x-ncp-apigw-api-key: {API Key}' \
// --header 'Accept: application/json'

	async GetAddressDetailByAddress(store_address:String){
      if(store_address){
        try{
          const api_key_id = '87ni0cgqze';
          const api_key = 'HTCVvQAFfYGRgtp1T4gN8aQUkfrbAcszWr95VuOj';
          const url = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query='+store_address
          const header = {headers:{'x-ncp-apigw-api-key-id': `${api_key_id}`,
                      'x-ncp-apigw-api-key':`${api_key}`,
                      'Accept': 'application/json'
                      },
                      httpsAgent: new https.Agent({
                        rejectUnauthorized: false, // ✅ SSL 인증서 검증 비활성화
                      }),
                  };

          const addr_detail = await axios.get(url,header);
            if(addr_detail){
            const addressElements = addr_detail.data.addresses[0].addressElements;
            const country = addressElements[0].shortName;
            const city = addressElements[1].shortName;
            const dong = addressElements[2].shortName;

            return {
              country :country,
              city:city,
              dong:dong
            }
          }

        }catch(error){
          console.log(error);
        }
      }else{
        return {
          error:-999,
          message:"store name empty"
        }
      }
    }

}