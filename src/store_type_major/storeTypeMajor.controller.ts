import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { StoreTypeMajorService } from "./storeTypeMajor.service";
import { KafkaService } from "src/kafka_producer/kafka.service";
import { StoreTypeMajorDTO } from './dto/StoreTypeMajorDTO';


@ApiTags('storeTypeMajor')
@Controller('storeTypeMajor')
export class StoreTypeMajorController {
    constructor(
        private readonly storeTypeMajorService: StoreTypeMajorService,
        private readonly loggerService: KafkaService
    ) {}
    
    @Get('/getStoreTypeMajors')
    async storeManageTest(): Promise<StoreTypeMajorDTO[]> {
        return this.storeTypeMajorService.findAll();
    }
}