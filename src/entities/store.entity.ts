import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, BeforeInsert } from 'typeorm';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { StoreLocationInfoTbl } from './store_location_info_tbl.entity';
import { ApiProperty } from '@nestjs/swagger';
import { StoreTypeLinkTbl } from './store_type_link_tbl.entity';
import { ObjectType, Field, Int ,Float,GraphQLISODateTime} from '@nestjs/graphql';


@ObjectType()
@Entity('store')
export class Store {
    @ApiProperty({ description: '가게 고유 번호 (Primary Key)', example: 1 })
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    seq: number;

    @ApiProperty({ description: '가게 이름', example: '맛있는 김밥' })
    @Field(() => String , { nullable: false })
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @ApiProperty({ description: '가게 유형', example: 'restaurant' })
    @Field(() => String, { nullable: false })
    @Column({ type: 'varchar', length: 30, nullable: false })
    type: string;

    @ApiProperty({ description: '사용 여부 (Y/N)', example: 'Y' })
    @Field(() => String, { nullable: true })
    @Column({ type: 'char', length: 1, default: 'Y', nullable: true })
    use_yn: string;

    @ApiProperty({ description: '등록 날짜', example: '2024-03-07T12:00:00Z' })
    @Field(() => GraphQLISODateTime, { nullable: false })  
    @Column({ type: 'timestamp', nullable: false })
    reg_dt: Date;

    @ApiProperty({ description: '등록한 사용자 ID', example: 'admin123' })
    @Field(() => String, { nullable: false })
    @Column({ type: 'varchar', length: 25, nullable: false })
    reg_id: string;

    @ApiProperty({ description: '마지막 수정 날짜', example: '2024-03-08T14:30:00Z', nullable: true })
    @Field(() => GraphQLISODateTime, { nullable: true })
    @Column({ type: 'timestamp', nullable: true })
    chg_dt: Date;

    @ApiProperty({ description: '마지막 수정한 사용자 ID', example: 'editor456', nullable: true })
    @Field(() => String, { nullable: true })
    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
    
    /* 아래 구조는 개선이 필요해 보임 */
    @ApiProperty({ description: '비플페이 가맹점 여부', example: true })
    @Field(() => Boolean, { nullable: true })
    is_beefulpay: boolean;

    @ApiProperty({ description: '주소', example: '서울시 강남구' })
    @Field(() => String, { nullable: true })
    address: string;

    @ApiProperty({ description: '위도', example: 37.5665 })
    @Field(() => Float, { nullable: true })
    lat: number;

    @ApiProperty({ description: '경도', example: 126.9780 })
    @Field(() => Float, { nullable: true })
    lng: number;

    @ApiProperty({ description: '도시', example: '서울' })
    @Field(() => String, { nullable: true })
    location_city: string;

    @ApiProperty({ description: '군/구', example: '강남구' })
    @Field(() => String, { nullable: true })
    location_county: string;

    @ApiProperty({ description: '구/동', example: '역삼동' })
    @Field(() => String, { nullable: true })
    location_district: string;

    @ApiProperty({ description: '하위 유형', example: 1 })
    @Field(() => Int, { nullable: true })
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