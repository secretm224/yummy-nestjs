import { Controller, Get, Post, Body, Query, Param ,Headers} from '@nestjs/common';
import { SearchService } from './search.service';
import { StoreSearch } from 'src/entities/store_search.entity';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

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


	@Get('allData')
	async getAllStores(@Headers('yummy-key') apikey: string): Promise<StoreSearch[]> {
		
		if (!apikey || apikey !== process?.env?.YUMMY_API_KEY) {
			throw new Error('yummy-key is invalid');
		}

		return this.searchService.searchAll<StoreSearch>('yummy-index', StoreSearch);
	}

	
	/* 테스트 코드 -> 검색결과 API*/
	@Get('searchStoreDatas')
	async getSearchStoreDatas(
		@Query('searchData') searchData: string
	): Promise<StoreSearch[]> {

		/* 01. 문자열 파싱 */
		searchData = this.searchService.stringTranformationFunction(searchData);
		console.log(searchData);

		return this.searchService.searchStoreDate<StoreSearch>('yummy-index', searchData, StoreSearch);
	}
	
}