import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';


export class TotalSearchResultDTO {
    @IsString()
    address: string;
  
    @IsString()
    lat: string;
  
    @IsString()
    lng: string;
  
    @IsString()
    location_city: string;
  
    @IsString()
    location_county: string;
  
    @IsString()
    location_district: string;
  
    @IsArray()
    @IsNumber({}, { each: true }) // 배열 내 숫자 검증
    @Type(() => Number)
    major_type: number[];
  
    @IsString()
    name: string;
  
    @IsArray()
    @IsString({ each: true }) // 배열 내 문자열 검증
    recommend_names: string[];
  
    @IsNumber()
    @Type(() => Number)
    seq: number;
  
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    sub_type: number[];
  
    @IsString()
    timestamp: string;
  
    @IsString()
    type: string;
  
    @IsBoolean()
    @Type(() => Boolean)
    zero_possible: boolean;
  }