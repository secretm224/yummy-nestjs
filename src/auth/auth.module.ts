import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // UserRepository가 아닌 User Entity를 등록
  providers: [AuthService,UserRepository],
  exports:[AuthService,UserRepository]

})
export class AuthModule {

}
