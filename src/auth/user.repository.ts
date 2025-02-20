// user.repository.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async SaveUser(token:any){

    console.log('auth service = ' + token.data);
    
    if(!token?.data || !token?.data?.refresh_token){
        throw new HttpException('refresh toekn empty',HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.login_channel = 'Kakao';
    user.refresh_token = token?.data?.refresh_token;
    user.reg_id = 'usersystem';
    user.reg_dt = new Date();

    return this.save(user);

  }
}
