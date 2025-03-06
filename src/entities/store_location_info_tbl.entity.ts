import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { Store } from './store.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('store_location_info_tbl')
export class StoreLocationInfoTbl {
    @PrimaryColumn()
    seq: number;

    @ApiProperty({ description: '가게 주소', example: '서울특별시 강남구 테헤란로 123' })
    @Column({ type: 'varchar', length: 500, nullable: true })
    address: string;

    @ApiProperty({ description: '위도', example: 37.5665 })
    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lat: number;
  
    @ApiProperty({ description: '경도', example: 126.9780 })
    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lng: number;

    @ApiProperty({ description: '등록 날짜', example: '2024-03-07T12:00:00Z' })
    @Column({ type: 'timestamp', nullable: false })
    reg_dt: Date;

    @ApiProperty({ description: '등록한 사용자 ID', example: 'admin123' })
    @Column({ type: 'varchar', length: 25, nullable: false })
    reg_id: string;

    @ApiProperty({ description: '마지막 수정 날짜', example: '2024-03-08T14:30:00Z', nullable: true })
    @Column({ type: 'timestamp', nullable: true })
    chg_dt: Date;

    @ApiProperty({ description: '마지막 수정한 사용자 ID', example: 'editor456', nullable: true })
    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;

    @ApiProperty({ description: '도시', example: '서울' })
    @Column({ type: 'varchar', length: 25, nullable: true })
    location_city: string;

    @ApiProperty({ description: '군/구', example: '강남구' })
    @Column({ type: 'varchar', length: 25, nullable: true })
    location_county: string;

    @ApiProperty({ description: '읍/면/동', example: '신사동' })
    @Column({ type: 'varchar', length: 25, nullable: true })
    location_district: string;
}