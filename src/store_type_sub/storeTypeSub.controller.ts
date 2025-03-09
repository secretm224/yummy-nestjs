import { KafkaService } from "src/kafka_producer/kafka.service";
import { StoreTypeSubService } from "./storeTypeSub.service";
import { Controller, Get, Post, Body, Query, Param ,Headers} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { StoreTypeSub } from "src/entities/store_type_sub.entity";


@ApiTags('storeTypeSub')
@Controller('storeTypeSub')
export class StroeTypeSubController {
    constructor(
        private readonly storeTypeSubService: StoreTypeSubService,
        private readonly loggerService: KafkaService
    ) {}



    @Get('findSubTypes')
    async getStoreSubTypeByMajor(@Query('majorType') majorType: string): Promise<StoreTypeSub[] | null> {
        
        console.log('test!!!');

        return this.storeTypeSubService.findSubTypes(majorType);
    } 
}