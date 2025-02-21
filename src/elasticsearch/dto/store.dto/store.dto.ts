import { IsObject, IsNumber, IsOptional } from 'class-validator';

// npm install class-validator class-transformer -> 설치해야 함

class QueryDto {
  @IsObject()
  match: Record<string, any>;

  @IsNumber()
  @IsOptional()
  size?: number;
}

export class StoreDto {
  @IsObject()
  query: QueryDto;
}





