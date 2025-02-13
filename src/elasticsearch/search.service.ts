import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchDto } from './dto/search.dto/search.dto';
import { SearchResultDto } from './dto/search.dto/search-result.dto';

@Injectable()
export class SearchService {
    constructor(private readonly elasticService: ElasticsearchService) {}

//   async createIndex(index: string) {
//     return this.elasticsearchService.indices.create({ index });
//   }

//   async addDocument(index: string, id: string, body: any) {
//     return this.elasticsearchService.index({
//       index,
//       id,
//       body,
//     });
//   }

    async search(index: string, searchDto: SearchDto): Promise<SearchResultDto> {
        
        console.log(searchDto);

        const response = await this.elasticService.search({
            index,
            body: searchDto,
        });
            
        const hits = response.hits.hits.map(hit => hit._source);

        return {hits};
    }
}
