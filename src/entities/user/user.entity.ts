import { Entity, PrimaryGeneratedColumn, Column,OneToMany} from 'typeorm';
import { UserAuth } from './user_auth.entity';
import { UserDetail } from './user_detail.entity';


@Entity('user_tbl')
export class User {
    @PrimaryGeneratedColumn()
    user_no: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    user_nm: string;

    @Column({ type: 'timestamp', nullable: true })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    reg_id: string;

    @Column({ type: 'timestamp', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;

    @OneToMany(() => UserAuth, (userAuth) => userAuth.user)
    auths: UserAuth[];
  
    @OneToMany(() => UserDetail, (userDetail) => userDetail.user)
    details: UserDetail[];
}
