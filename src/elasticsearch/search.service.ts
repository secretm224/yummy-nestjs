import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
    constructor(private readonly elasticService: ElasticsearchService) {}

    /*
        특정 인덱스의 모든 데이터를 가져오는 함수 -> Elasticsearch 특성상 한번에 10,000개만 가져올 수 있으므로 주의.
    */
    async searchAll<T>(index: string, model: new (data: any) => T): Promise<T[]> {
        const result: SearchResponse<any> = await this.elasticService.search({
            index: index,
            body: {
                query: {
                    match_all: {}
                },
                size: 10000
            }
        });

        return result.hits.hits.map(hit => new model({
            ...hit._source, 
            timestamp: hit._source.timestamp ? new Date(hit._source.timestamp) : undefined
        }));
    }
}
