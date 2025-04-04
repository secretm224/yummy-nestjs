import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { KafkaModule } from 'src/kafka_producer/kafka.module';
import { StoreTypeMajorService } from 'src/store_type_major/storeTypeMajor.service';
import { StoreTypeMajor } from 'src/entities/store_type_major.entity';
import { RedisModule } from 'src/redis/redis.module';



@Module({
    imports: [
        TypeOrmModule.forFeature([StoreTypeMajor]),
        KafkaModule,
        RedisModule,
        ConfigModule.forRoot({ 
            isGlobal: true,
            envFilePath:process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
        }),
        ElasticsearchModule.register({
            nodes: (process.env.ELASTICSEARCH_NODE || '').split(','), /* 환경 변수에서 여러 노드 읽기 -> Cluster 이므로 */ 
            auth: {
                username: process.env.ELASTICSEARCH_USERNAME || '',
                password: process.env.ELASTICSEARCH_PASSWORD || '',
            }
        })
    ],
    controllers: [SearchController], // ✅ 컨트롤러 추가
    providers: [SearchService, StoreTypeMajorService], // ✅ 서비스 추가
    exports: [ElasticsearchModule, SearchService], // ✅ SearchService도 내보내기
})

export class SearchModule {}