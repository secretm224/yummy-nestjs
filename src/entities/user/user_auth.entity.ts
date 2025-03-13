import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn} from 'typeorm';
import{User} from './user.entity';

@Entity('user_auth_tbl')
export class UserAuth {
    @PrimaryGeneratedColumn()
    auth_no: number;

    @ManyToOne(()=>User,(user) =>user.auths,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'user_no' }) 
    user:User;

    @Column({type:'int',nullable:false})
    user_no:number;

    @Column({type:'varchar',length:10,nullable:false})
    login_channel: string;
    
    @Column({type:'varchar',length:225,nullable:false})
    token_id : string;

    @Column({ type: 'timestamp', nullable: true })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    reg_id: string;

    @Column({ type: 'timestamp', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
}
