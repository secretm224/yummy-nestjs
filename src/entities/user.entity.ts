import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    user_no: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    login_channel: string;

    @Column({ type: 'bigint', nullable: true })
    token_id: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    refresh_token: string;

    @Column({ type: 'datetime', nullable: true })
    reg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    reg_id: string;

    @Column({ type: 'datetime', nullable: true })
    chg_dt: Date;

    @Column({ type: 'varchar', length: 25, nullable: true })
    chg_id: string;
}
