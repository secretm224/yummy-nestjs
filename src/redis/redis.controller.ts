import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { RedisService } from './redis.service';
import { StoreTypeMajorDTO } from '../store_type_major/dto/StoreTypeMajorDTO';

@Controller('redis')
export class RedisController {
	constructor(private readonly redisService: RedisService) {}

	@Get('get')
	async getValue(@Query('key') key: string) {

		if (!key) return { error: 'Key is required' };

		const value = await this.redisService.getValue(key);

		return { key, value };
	}
	
	@Post('set')
	async setValue(@Body() body: { key: string; value: string }) {
		if (!body.key || !body.value) return { error: 'Key and value are required' };

		await this.redisService.setValue(body.key, body.value);
		
		return { message: 'Value set successfully', key: body.key, value: body.value };
	}

	@Delete()
	async deleteValue(@Query('key') key: string) {
		if (!key) return { error: 'Key is required' };

		await this.redisService.deleteValue(key);
		
		return { message: 'Key deleted successfully', key };
	}

	// /**
	//  * Redis 에서 상점 대분류 데이터를 가져와주는 컨트롤러
	//  * 
	//  * @returns 상점 대분류 코드 데이터
	//  */
	// @Get('getMajorCategories')
	// async getMajorCategories(): Promise<StoreTypeMajorDTO[]> {

	// 	return await this.redisService.getMajorCategories();

	// }
}
