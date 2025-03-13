import { Controller, Get, Post, Body, Query, Param ,Headers, Render, Req, Res} from '@nestjs/common';
import { SearchService } from './search.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import { StoreSearch } from 'src/entities/store_search.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoreTypeMajorService } from 'src/store_type_major/storeTypeMajor.service';

@ApiTags('search') 
@Controller('search')
export class SearchController {
	constructor(
		private readonly searchService: SearchService,
		private readonly storeTypeMajorService: StoreTypeMajorService,
		private readonly loggerService: KafkaService,
	) {}
	
	/* 검색 테스트 페이지 */
	@Get('searchTest')
	@Render('searchTest')
	async searchTestPage(@Req() req: Request) {	
		
		try {

			const storeTypes = await this.storeTypeMajorService.findAll();

			return {
				title: 'search 테스트 페이지',
				storeTypes,
				css: '<link rel="stylesheet" href="/css/searchTest.css">',
			}
			
		} catch(err) {
			console.error('Error fetching store types:', err);
			return { title: '검색 테스트 페이지지', storeTypes: [], error: '데이터를 불러올 수 없습니다.:' };
		}
	}

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

	// @Get('totalSearch')
	// async getTotalSearchData(
	// 	@Query('searchData') searchData:
	// ): Promise<StoreSearch[] | null> {
	// 	try {

	// 		const searchDTO = this.

	// 	} catch(err) {
	// 		await this.SendLog(err);
	// 		return null;
	// 	}
	// }

	
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