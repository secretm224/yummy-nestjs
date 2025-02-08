import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZeroPossibleMarket } from 'src/entities/zero_possible_market.entity';
import { ZeroPossibleService } from './zeroPossible.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZeroPossibleMarket]), // orm 엔티티 등록
  ],
  providers: [ZeroPossibleService], // ZeroPossibleService 등록
  exports: [ZeroPossibleService],   // 다른 모듈에서 사용하려면 export
})
export class ZeroPossibleModule {}
