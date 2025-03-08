import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert, PrimaryColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreTypeSub } from './store_type_sub.entity';
import { Store } from './store.entity';


@Entity('store_type_link_tbl')
export class StoreTypeLinkTbl {
    @ApiProperty({ description: '소분류 타입 코드', example: 1 })
    @PrimaryColumn()
    sub_type: number;
    
    @ApiProperty({ description: '음식점 고유 번호', example: 1 })
    @PrimaryColumn()
    seq: number;
    
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

    @ManyToOne(() => StoreTypeSub, (storeTypeSub) => storeTypeSub, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({ name: 'sub_type'})
    storeTypeSub: StoreTypeSub;

    @ManyToOne(() => Store, (store) => store, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({ name: 'seq'})
    store: Store;
}