import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ZeroPossibleMarket } from '../entities/zero_possible_market.entity';
import { Store } from './store.entity';


@Entity('store_location_info_tbl')
export class StoreLocationInfoTbl {
    @PrimaryColumn()
    seq: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lat: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lng: number;

    @Column({ type: 'datetime', nullable: false })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: false })
    reg_id: string;

    @Column({ type: 'datetime', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    location_city: string;
    
    @Column({ type: 'varchar', length: 25, nullable: true })
    location_county: string;
    
    @Column({ type: 'varchar', length: 25, nullable: true })
    location_district: string;
}