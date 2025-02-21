import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsDate } from 'class-validator';

export class StoreSearch {

    @IsNumber()
    seq: number;

    @IsDate()
    timestamp: Date;
    
    @IsString()
    address: string;

    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;

    @IsString()
    name: string;

    @IsArray()
    @IsOptional()
    recommend_names: string[];

    @IsString()
    type: string;

    @IsBoolean()
    zero_possible: boolean;
    
    constructor(partial: Partial<StoreSearch>) {
        Object.assign(this, partial);
    }
}