
import { Resolver, Mutation,Query, Args } from '@nestjs/graphql';
import { StoreService } from './store.service';
import { StoreLocationInfoService } from '../store_location_info/storeLocation.service';
import { ZeroPossibleService } from '../zero_possible_market/zeroPossible.service';
import { KafkaService } from '../kafka_producer/kafka.service';

import { Store } from '../entities/store.entity';
import { DataSource } from 'typeorm';
import { Util } from '../util/datautil';
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
  // mutation {
  //   createStore(createStoreInput: {
  //     name: "GraphQL Store",
  //     type: "restaurant",
  //     use_yn: "Y",
  //     is_beefulpay: true,
  //     address: "123 Main Street",
  //     lat: 37.5665,
  //     lng: 126.9780,
  //     location_city: "Seoul",
  //     location_county: "Gangnam-gu",
  //     location_district: "Yeoksam-dong",
  //     sub_type: 1
  //   }) {
  //     seq
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
  //     reg_dt
  //     reg_id
  //   }
  // }
  

  @Mutation(() => Store)
  async  createStore(@Args('createStoreInput') createStoreInput: CreateStoreInput) {
    // return this.storeService.create(createStoreInput);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Step 1: Store 생성
      createStoreInput.reg_dt =  createStoreInput.reg_dt ?? Util.GetUtcDate();
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

//   @Query(() => Store, { name: 'getStoreById', nullable: true })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.storeService.findOne(id);
//   }

  @Mutation(() => Store)
  updateStore(@Args('updateStoreInput') updateStoreInput: UpdateStoreInput) {
    return this.storeService.update(updateStoreInput);
  }

//   @Mutation(() => Boolean)
//   removeStore(@Args('id', { type: () => Int }) id: number) {
//     return this.storeService.remove(id);
//   }
// 
}
