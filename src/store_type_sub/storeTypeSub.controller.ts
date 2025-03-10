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


    /**
     * 대분류 코드에 매칭되는 소분류 정보를 반환해주기 위한 컨트롤러
     * @param majorType - 대분류 코드 번호
     * @returns 
     */
    @Get('findSubTypes')
    async getStoreSubTypeByMajor(@Query('majorType') majorType: string): Promise<StoreTypeSub[] | null> {
        return this.storeTypeSubService.findSubTypes(majorType);
    } 
}