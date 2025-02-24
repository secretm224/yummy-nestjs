import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async getValue(@Query('key') key: string) {
    
    if (!key) return { error: 'Key is required' };

    const value = await this.redisService.getValue(key);
    
    return { key, value };
  }

  @Post()
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
}
