import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('store')
export class Store {
    @PrimaryGeneratedColumn()
    seq: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    type: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lat: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lng: number;

    @Column({ type: 'datetime', nullable: true })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    reg_id: string;

    @Column({ type: 'datetime', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
}