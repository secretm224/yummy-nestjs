import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { UserRepository } from './user.repository';
import {User} from '../entities/user/user.entity';
import {UserAuth} from '../entities/user/user_auth.entity';
import {UserDetail} from '../entities/user/user_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users,UserRepository,User, UserAuth, UserDetail])], // UserRepository가 아닌 User Entity를 등록
  providers: [AuthService,UserRepository],
  exports:[AuthService,UserRepository]

})
export class AuthModule {

}
