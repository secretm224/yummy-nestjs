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
  
    @Post("/add")
    async create(@Body() store: Partial<Store>): Promise<Store> {

        store.reg_dt = new Date();
        store.reg_id = "secretm";

      return this.storeService.create(store);
    }

    @Post("/update")
    async update(@Body() store: Partial<Store>): Promise<Store | null> {

        return this.storeService.update(store);
    }
}


