import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreTypeMajor } from './store_type_major.entity';
import { StoreTypeLinkTbl } from './store_type_link_tbl.entity';


@Entity('store_type_sub')
export class StoreTypeSub {
    @ApiProperty({ description: '소분류 타입 코드', example: 1 })
    @PrimaryGeneratedColumn()
    sub_type: number;
    
    @ApiProperty({ description: '대분류 타입 코드', example: 1 })
    @Column({ type: 'int',  nullable: false })
    major_type: number;

    @ApiProperty({ description: '소분류 타입 이름', example: '돈까스' })
    @Column({ type: 'varchar', length: 255, nullable: false })
    type_name: string;
    
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

    /** 
     * @ManyToOne 관계 설정 (외래 키 제약 조건 생성 안 함)
     */
    @ManyToOne(() => StoreTypeMajor, (storeTypeMajor) => storeTypeMajor.store_type_sub, {
        createForeignKeyConstraints: false, /* 외래 키 제약 조건 비활성화 */ 
    })
    @JoinColumn({ name: 'major_type' }) /* 실제 DB 컬럼을 지정하지만 FK 제약은 없음 */
    storeTypeMajor: StoreTypeMajor;

    @OneToMany(() => StoreTypeLinkTbl, (storeTypeLinkTbl) => storeTypeLinkTbl.storeTypeSub)
    storeTypeLinkTbl: StoreTypeLinkTbl[];
}