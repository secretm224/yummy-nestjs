import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { StoreLocationInfoTbl } from './store_location_info_tbl.entity';

@Entity('store')
export class Store {
    @PrimaryGeneratedColumn()
    seq: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    type: string;

    @Column({ type: 'char', length: 1, default: 'Y', nullable: true })
    use_yn: string;

    @Column({ type: 'datetime', nullable: false })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: false })
    reg_id: string;

    @Column({ type: 'datetime', nullable: true })
    chg_dt: Date;

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
    
    @OneToOne(() => ZeroPossibleMarket, { createForeignKeyConstraints: false })
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    zero_possible_market: ZeroPossibleMarket | null;

    @OneToOne(() => StoreLocationInfoTbl, { createForeignKeyConstraints: false })
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    store_location_info_tbl: StoreLocationInfoTbl;
}