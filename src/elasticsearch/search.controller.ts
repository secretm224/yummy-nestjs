import { Controller, Get, Post, Body, Query, Param ,Headers} from '@nestjs/common';
import { SearchService } from './search.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { StoreSearch } from 'src/entities/store_search.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('search') 
@Controller('search')
export class SearchController {
	constructor(
		private readonly searchService: SearchService,
		private readonly loggerService: KafkaService,
	) {}

	// @Post('index/:index')
	// async createIndex(@Param('index') index: string) {
	// 	return this.searchService.createIndex(index);
	// }

	// @Post('document/:index/:id')
	// async addDocument(
	// 	@Param('index') index: string,
	// 	@Param('id') id: string,
	// 	@Body() body: any,
	// ) {
	// 	return this.searchService.addDocument(index, id, body);
	// }
	
	// Test code
	// @Get(':index')
	// async search(
	// 	@Param('index') index: string, 
	// 	@Query('keyword') keyword: string
	// ): Promise<SearchResultDto> {
		
	// 	const searchDto: SearchDto = {
	// 		query: {
	// 			match: {
	// 				consume_keyword: keyword
	// 			}
	// 		}
	// 	};
		
	// 	return this.searchService.search(index, searchDto);
	// }

	// async findAll(@Headers('yummy-key') apikey: string): Promise<Store[]> {

	@ApiOperation({ summary: 'search data inquery', description: 'inquery to search data' })
	@ApiResponse({ status: 200, description: 'inquery store data by search' })
	@Get('allData')
	async getAllStores(@Headers('yummy-key') apikey: string): Promise<StoreSearch[]> {
		
		if (!apikey || apikey !== process?.env?.YUMMY_API_KEY) {
			throw new Error('yummy-key is invalid');
		}

		return this.searchService.searchAll<StoreSearch>('yummy-index', StoreSearch);
	}

	@Get('autoComplete')
	async getAutoComplete(
		@Query('searchData') searchData: string
	): Promise<StoreSearch[] | null> {
		
		try {
			const searchDto = this.searchService.stringTranformationFunction(searchData); /* 문자열 파싱 */
			return this.searchService.searchAutoCompleteDatas<StoreSearch>('yummy-index', searchDto, StoreSearch);	
		} catch(err) {
			await this.SendLog(err);
			return null;
		}	
	}

	
	// /* 테스트 코드 -> 검색결과 API*/
	// @Get('searchStoreDatas')
	// async getSearchStoreDatas(
	// 	@Query('searchData') searchData: string
	// ): Promise<StoreSearch[]> {

	// 	/* 01. 문자열 파싱 */
	// 	searchData = this.searchService.stringTranformationFunction(searchData);

	// 	return this.searchService.searchStoreDate<StoreSearch>('yummy-index', searchData, StoreSearch);
	// }
	async SendLog(message: any) {
		try {
			await this.loggerService.sendMessage('yummy-store', message);
		} catch (error) {
			console.log('faile to log to kafka', error);
		}
	}
}