import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('zero_possible_market')
export class ZeroPossibleMarket {
    @PrimaryColumn()
    seq: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'char', length: 1, nullable: true })
    use_yn: string;

    @Column({ type: 'datetime', nullable: false })
    reg_dt: Date;
    
    @Column({ type: 'datetime', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: false })
    reg_id: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
}