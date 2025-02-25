// user.repository.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import {Util} from '../util/datautil';

@Injectable()
export class UserRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async SaveUser(token:any){

    console.log('auth service = ' + token.data);
    
    if(!token?.data || !token?.data?.refresh_token){
        throw new HttpException('refresh toekn empty',HttpStatus.BAD_REQUEST);
    }

    let token_id = "0"; 
    if(!!token?.data.id_token){
      const user_info = jwt.decode(token.data.id_token);
      if(!!user_info){
        token_id = user_info?.sub?.toString() ?? "0";
      }
    }

    const user = new Users();
    user.login_channel = 'KAKAO';
    user.token_id = token_id;
    user.refresh_token = token?.data?.refresh_token;
    user.reg_id = 'usersystem';
    user.reg_dt = Util.GetUtcDate();

   return this.save(user);
   
  }
}
