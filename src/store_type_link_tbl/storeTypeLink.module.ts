import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreTypeLinkTbl } from "src/entities/store_type_link_tbl.entity";
import { KafkaModule } from "src/kafka_producer/kafka.module";
import { StoreTypeLinkService } from "./storeTypeLink.service";
import { StoreTypeLinkController } from "./storeTypeLinkcontroller";


@Module({
    imports: [
        TypeOrmModule.forFeature([StoreTypeLinkTbl]), /*  orm 엔티티 등록 */
        KafkaModule
    ],
    providers: [StoreTypeLinkService],
    controllers: [StoreTypeLinkController],
    exports: [StoreTypeLinkService, TypeOrmModule]
})
export class StoreTypeLinkModule {}