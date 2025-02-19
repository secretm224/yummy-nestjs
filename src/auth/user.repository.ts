import {EntityManager , EntityTarget,Repository,DataSource} from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';    
import { InjectRepository  } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';


@Injectable()
export class UserRepository  {
   constructor(
        private readonly datasource:DataSource,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private user:User,
   ){}

    //async SaveUser(user:Partial<User>):Promise<User | null>{
     async SaveUser(token:any){

        if(!token){
            throw new HttpException('token is empty',HttpStatus.BAD_REQUEST);
        }

        this.user.login_channel = "Kakao";
        this.user.refresh_token = token.refresh_token;
        this.user.reg_dt = new Date();
        this.user.reg_id = "KakaoLoginSystem";

        return this.userRepository.save(this.user);
    }
   
}