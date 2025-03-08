import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StoreTypeSub } from './store_type_sub.entity';


@Entity('store_type_major')
export class StoreTypeMajor {
    @ApiProperty({ description: '대분류 타입 코드', example: 1 })
    @PrimaryGeneratedColumn()
    major_type: number;

    @ApiProperty({ description: '대분류 타입 이름', example: '한식' })
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

    @OneToMany(() => StoreTypeSub, (storeTypeSub) => storeTypeSub.storeTypeMajor)
    store_type_sub: StoreTypeSub[];
}