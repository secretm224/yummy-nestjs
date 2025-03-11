
import { Resolver, Mutation,Query, Args } from '@nestjs/graphql';
import { StoreService } from './store.service';
import { StoreLocationInfoService } from '../store_location_info/storeLocation.service';
import { ZeroPossibleService } from '../zero_possible_market/zeroPossible.service';
import { KafkaService } from '../kafka_producer/kafka.service';
import { StoreLocationInfoTbl } from 'src/entities/store_location_info_tbl.entity';
import { Store } from '../entities/store.entity';
import { DataSource } from 'typeorm';
// import { Util } from '../util/datautil';
import { CreateStoreInput } from './dto/create-store.input/create-store.input';
import { UpdateStoreInput } from './dto/update-store.input/update-store.input';

@Resolver(() => Store)
export class StoreResolver {
  constructor(
    private readonly storeService: StoreService,
    private readonly storeLocationInfoService: StoreLocationInfoService,
    private readonly zeroPossibleService: ZeroPossibleService,
    private readonly kafkaService: KafkaService,
    private readonly dataSource: DataSource,
  ) {}

  // url : http://localhost:3000/graphql
//   mutation {
//     createStore(createStoreInput: {
//       name: "GraphQL Store",
//       type: "restaurant",
//       use_yn: "Y",
//       is_beefulpay: true,
//       address: "123 Main Street",
//       lat: 37.5665,
//       lng: 126.9780,
//       location_city: "Seoul",
//       location_county: "Gangnam-gu",
//       location_district: "Yeoksam-dong",
//       sub_type: 1
//     }) {
//       seq
//       name
//       type
//       use_yn
//       is_beefulpay
//       address
//       lat
//       lng
//       location_city
//       location_county
//       location_district
//       sub_type
//       reg_dt
//       reg_id
//     }
//   }
  

  @Mutation(() => Store)
  async  createStore(@Args('createStoreInput') createStoreInput: CreateStoreInput) {
    // return this.storeService.create(createStoreInput);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Step 1: Store 생성
      createStoreInput.reg_dt =  createStoreInput.reg_dt ?? new Date(new Date().toISOString());
      createStoreInput.reg_id = createStoreInput.reg_id ?? 'system';

      const saveStore = await this.storeService.create(createStoreInput, queryRunner);

      // ✅ Step 2: StoreLocationInfo 생성
      if (saveStore != null) {
        await this.storeLocationInfoService.create(saveStore, createStoreInput, queryRunner);

        // ✅ Step 3: ZeroPossibleMarket 생성
        saveStore.is_beefulpay = createStoreInput.is_beefulpay ?? false;
        const zeroPossible = await this.zeroPossibleService.create(saveStore, queryRunner);

        // ✅ Step 4: 로그 전송 (Kafka)
        if (zeroPossible != null) {
          await this.kafkaService.sendMessage('yummy-store', saveStore);
        }
      }

      await queryRunner.commitTransaction();
        return saveStore;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        await this.kafkaService.sendMessage('yummy-store',err); // 오류 로그 전송
        return null;
      } finally {
        await queryRunner.release();
      }
  }
   
  // url : http://localhost:3000/graphql
  // query {
  //   getAllStores {
  //     name
  //     type
  //     use_yn
  //     is_beefulpay
  //     address
  //     lat
  //     lng
  //     location_city
  //     location_county
  //     location_district
  //     sub_type
  //   }
  // }
  
  @Query(() => [Store], { name: 'getAllStores' })
  findAll() {
    return this.storeService.findAll();
  }

// url : http://localhost:3000/graphql
  // query {
  //   getStoreByName(store_name: "선릉돈까스") {
  //     seq
  //     name
  //     type
  //     use_yn
  //     address
  //     lat
  //     lng
  //   }
  // }

  @Query(() => Store, { name: 'getStoreByName', nullable: true })
  findOne(@Args('store_name', { type: () => String }) store_name: string) {

    return this.storeService.findByName(store_name);
  }

// url : http://localhost:3000/graphql
//   mutation {
//     updateStore(updateStoreInput: {
//       name: "GraphQL Store test4",
//       lat: 37.1234,
//       lng: 126.5678
//     }) {
//       seq
//       name
//       lat
//       lng
//       chg_dt
//       chg_id
//     }
//   }
  @Mutation(() => Store, { nullable: true })
  updateStore(@Args('updateStoreInput') updateStoreInput: UpdateStoreInput) {

    return this.storeService.update(updateStoreInput);
  }

//   @Mutation(() => Boolean)
//   removeStore(@Args('id', { type: () => Int }) id: number) {
//     return this.storeService.remove(id);
//   }
// 

// query {
//   SetAddressDetailByStoreName(store_name: "나이스샤워") {
//     seq
//     name
//     type
//     use_yn
//     address
//     lat
//     lng
//     location_city
//     location_county
//     location_district
//   }
// }
 @Query(() => Store, { name: 'SetAddressDetailByStoreName', nullable: true })
 async SetAddressDetailByStoreName(@Args('store_name', { type: () => String }) store_name: string) {
    
    const store_info = await this.storeService.findByName(store_name);
    console.log('store_info= '+store_info);
    if(store_info){
        const address = store_info.address;
        console.log('address= '+address);
        if(address){
            const addr_detail = await this.storeLocationInfoService.GetAddressDetailByAddress(address);
            console.log('addr_detail= '+addr_detail);
            if(addr_detail){
                const location_obj = await this.storeLocationInfoService.GetLocationInfo(store_info?.seq);
                if(location_obj){
                  location_obj.location_county = addr_detail.country ?? location_obj.location_county;
                  location_obj.location_city = addr_detail.city ?? location_obj.location_city;
                  location_obj.location_district = addr_detail.dong ?? location_obj.location_district;
                  
                  const update_location = await this.storeLocationInfoService.SetLocationDetailInfo(location_obj);
                  if(update_location){
                     return await this.storeService.findByName(store_name);
                  }
                  return store_info;
                }
            }
        }
    }
    return null;
    //return this.storeService.SetAddressDetailByStoreName(store_name);
  }
}
