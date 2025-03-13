import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from 'typeorm';
import{User} from './user.entity';


@Entity('user_detail_tbl')
export class UserDetail {
    @PrimaryGeneratedColumn()
    detail_no: number;

    @ManyToOne(() => User, (user) => user.details, { onDelete: 'CASCADE' })
    user: User;

    @Column({type:'int',nullable:false})
    user_no:number;

    @Column({ type: 'varchar', length: 2, nullable: false })
    addr_type : string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    addr : string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    lngx: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: false })
    laty: number;

    @Column({ type: 'timestamp', nullable: true })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    reg_id: string;

    @Column({ type: 'timestamp', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
}
