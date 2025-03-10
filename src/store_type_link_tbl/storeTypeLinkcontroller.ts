import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StoreTypeLinkService } from "./storeTypeLink.service";
import { KafkaService } from "src/kafka_producer/kafka.service";


@ApiTags('storeTypeLink')
@Controller('storeTypeLink')
export class StoreTypeLinkController {
    constructor(
        private readonly storeTypeLinkService: StoreTypeLinkService,
        private readonly loggerService: KafkaService
    ) {}
}