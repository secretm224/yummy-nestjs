import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../entities/store.entity';

@Controller('store')
export class StoreController {

    constructor(private readonly storeService: StoreService) {}

    @Get("/all")
    async findAll(): Promise<Store[]> {
      return this.storeService.findAll();
    }
  
    @Post()
    async create(@Body() user: Partial<Store>): Promise<Store> {
      return this.storeService.create(user);
    }
}


