import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { StoreTypeMajorService } from "./storeTypeMajor.service";
import { KafkaService } from "src/kafka_producer/kafka.service";
import { StoreTypeMajor } from "src/entities/store_type_major.entity";


@ApiTags('storeTypeMajor')
@Controller('storeTypeMajor')
export class StoreTypeMajorController {
    constructor(
        private readonly storeTypeMajorService: StoreTypeMajorService,
        private readonly loggerService: KafkaService
    ) {}
    
    @Get('/test')
    async storeManageTest(): Promise<StoreTypeMajor[]> {
        return this.storeTypeMajorService.findAll();
    }
}