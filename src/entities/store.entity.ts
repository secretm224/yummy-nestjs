import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, BeforeInsert } from 'typeorm';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { StoreLocationInfoTbl } from './store_location_info_tbl.entity';
import { ApiProperty } from '@nestjs/swagger';
import { StoreTypeLinkTbl } from './store_type_link_tbl.entity';


@Entity('store')
export class Store {
    @ApiProperty({ description: '가게 고유 번호 (Primary Key)', example: 1 })
    @PrimaryGeneratedColumn()
    seq: number;

    @ApiProperty({ description: '가게 이름', example: '맛있는 김밥' })
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @ApiProperty({ description: '가게 유형', example: 'restaurant' })
    @Column({ type: 'varchar', length: 30, nullable: false })
    type: string;

    @ApiProperty({ description: '사용 여부 (Y/N)', example: 'Y' })
    @Column({ type: 'char', length: 1, default: 'Y', nullable: true })
    use_yn: string;

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
    
    /* 아래 구조는 개선이 필요해 보임 */
    is_beefulpay: boolean;
    address: string;
    lat: number;
    lng: number;
    location_city: string;
    location_county: string;
    location_district: string;
    sub_type: number;
    
    @OneToOne(() => ZeroPossibleMarket, { createForeignKeyConstraints: false })
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    zero_possible_market: ZeroPossibleMarket | null;

    @OneToOne(() => StoreLocationInfoTbl, { createForeignKeyConstraints: false })
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    store_location_info_tbl: StoreLocationInfoTbl;

    @OneToMany(() => StoreTypeLinkTbl, (storeTypeLinkTbl) => storeTypeLinkTbl.store)
    storeTypeLinkTbl: StoreTypeLinkTbl[];
}