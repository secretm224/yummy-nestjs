import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto/search.dto';
import { SearchResultDto } from './dto/search.dto/search-result.dto';

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

	@Get(':index')
	async search(
		@Param('index') index: string, 
		@Query('keyword') keyword: string
	): Promise<SearchResultDto> {
		
		const searchDto: SearchDto = {
			query: {
				match: {
					consume_keyword: keyword
				}
			}
		};
		
		return this.searchService.search(index, searchDto);
		//return this.searchService.search(index, keyword);
	}
}