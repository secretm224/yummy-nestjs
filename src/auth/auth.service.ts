import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import axios from 'axios';
import { UserRepository } from './user.repository';
import e from 'express';
import * as path from 'path';
import { Repository } from 'typeorm';
// import { access } from 'fs';

import {RegisterUserDto} from './dto/register.user.dto';
import {UserProfileDto} from './dto/select.user.dto';

import {User} from '../entities/user/user.entity';
import {UserAuth} from '../entities/user/user_auth.entity';
import {UserDetail} from '../entities/user/user_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Util } from '../util/datautil';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
               // private readonly userrepository:UserRepository , 
                  @InjectRepository(User)
                  private readonly user_repository:Repository<User> ,
                  @InjectRepository(UserAuth)
                  private readonly auth_repository:Repository<UserAuth> ,
                  @InjectRepository(UserDetail)
                  private readonly detail_repository:Repository<UserDetail>,
               ){}

    private readonly api_key = process?.env?.KAKAO_CLIENT_ID ?? "";

    // https://kauth.kakao.com/oauth/token" \
    // -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    // -d "grant_type=authorization_code" \
    // -d "client_id=${REST_API_KEY}" \
    // --data-urlencode "redirect_uri=${REDIRECT_URI}" \
    // -d "code=${AUTHORIZE_CODE}"

    async GetKaKaoToken(code:string){
        if(!code){
            throw new HttpException("kakao callback code data is empty",HttpStatus.BAD_REQUEST);
        }

        try{
            const url = process.env.KAKAO_AUTH_URL ?? "";
            //const redirect ="http://secretm-yummy.com:3000/auth/kakao/callback";
            const redirect = process.env.KAKAO_REDIRECT_URL ?? "";
            const param = new URLSearchParams({
                                                grant_type:'authorization_code',
                                                client_id:this.api_key,
                                                redirect_uri:redirect,
                                                code:code
                                            }).toString();

            const header = {headers:{'content-Type':'application/x-www-form-urlencoded;charset=utf-8'}};
            const kakao_token = await axios.post(url,param,header);

           // console.log("kakao token2="+ JSON.stringify(kakao_token));

            if(!!kakao_token){
                //this.userrepository.SaveUser(kakao_token);
                // name: userinfo?.nickname || 'GUEST',
                // picture: userinfo?.picture || '',
                // is_admin: is_admin,
                // login_channel: 'kakao',
                 //const kaKao_info = jwt.decode(kakao_token.data.id_token);
                
                //  if(kaKao_info) {
                //     //RegisterUserWithCoordinate(RegisterDto:RegisterUserDto):Promise<UserProfileDto | null>
                //     //token.data.id_token
                //     const register_user_dto:RegisterUserDto={
                //         //  user_nm:kakao_token.data.,
                //         // login_channel:save_auth.login_channel,
                //         // token_id:save_auth.token_id,
                //         // addr_type:detail.addr_type,
                //         // addr:detail.addr,
                //         // lngx:detail.lngx,
                //         // laty:detail.laty,
                //         // reg_dt:save_user.reg_dt,
                //     };

                // }

                return kakao_token.data;
            }else{
                throw new HttpException("kakao token data is empty",HttpStatus.BAD_REQUEST);
            }

        }catch(error){
            console.error('kakaoapi error = '+error.response?.data);
        }
    }

    async GetKakaoUserInfo(access_token:string){
        if(!access_token){
            throw new HttpException('accesss tokens is empty',HttpStatus.BAD_REQUEST);
        }

        try {
            const url = `${process.env.KAKAO_API_URL ?? ""}/v2/user/me`;
            const header = {headers:{
                'Authorization': `Bearer ${access_token}`, 
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }};
            
            const data = new URLSearchParams({
                property_keys: '["kakao_account.profile.nickname","kakao_account.profile.thumbnail_image"]'
            });

            const userinfo = await axios.post(url, data, header);
            const nickname = userinfo.data.kakao_account.profile.nickname;
            const image = userinfo.data.kakao_account.profile.thumbnail_image_url;
            const token_id = userinfo.data.id;

            if(!!nickname && !!image){
                return {nickname:nickname,picture:image,token_id:token_id};
            }

        }catch(error){
            console.error('get userinfo by access toekn'+error);
            console.error(error.response?.data);
        }
    }

    async CheckAccessTokenInfo(access_token:string){

        if(!access_token){
            return false;
        }

        let is_token = false;
        let check_token;

        try{
            const url = `${process.env.KAKAO_API_URL ?? ""}/v1/user/access_token_info`;
            const header = {headers:{'Authorization': `Bearer ${access_token}`}};
            const check_token = await axios.get(url,header);

            if(!!check_token && check_token.status === HttpStatus.OK){
                is_token = true;
            }else {
                is_token = false;
            }
            
            return is_token;

        }catch(error){
            check_token = null;
            is_token = false;
        }
       
    }

    // curl -v -X POST "https://kauth.kakao.com/oauth/token" \
    // -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    // -d "grant_type=refresh_token" \
    // -d "client_id=${REST_API_KEY}" \
    // -d "refresh_token=${USER_REFRESH_TOKEN}"

    async GetAccessTokenByRefreshToken(refresh_token:string){

        if(!refresh_token){
            throw new HttpException('bad request',HttpStatus.BAD_REQUEST);
        }

        try{
            const url = process.env.KAKAO_AUTH_URL ?? "";
            const rest_api_key = this.api_key;
            const header = {headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}};
            const data = new URLSearchParams({
                    grant_type:'refresh_token',
                    client_id : rest_api_key,
                    refresh_token:refresh_token
            });
            
            const ax_token = await axios.post(url, data, header);
            if(!!ax_token){
                return {
                    access_token:ax_token.data.access_token,
                    refresh_token:ax_token.data.refresh_token,
                    id_token:ax_token.data.id_token
                }
            }
        }catch(error){
            return {
                access_token:null,
                refresh_token:null,
                id_token:null
            }
        }
            
    }


    async RegisterUserWithCoordinate(RegisterDto:RegisterUserDto):Promise<UserProfileDto | null>{

        const regist_user = await this.RegisterUser(RegisterDto);

        return regist_user;
    }


    async RegisterUser(RegisterDto:RegisterUserDto):Promise<UserProfileDto | null>{
        if(RegisterDto){
            const user = this.user_repository.create({
                user_nm : RegisterDto?.user_nm,
                reg_dt:Util.GetUtcDate(),
                reg_id:"auth>RegisterUser"
            });

            const save_user = await this.user_repository.save(user);

            if(save_user){
                const auth = this.auth_repository.create({
                    user:save_user,
                    user_no:save_user.user_no,
                    login_channel:RegisterDto.login_channel,
                    token_id:RegisterDto.token_id,
                    reg_dt :Util.GetUtcDate(),
                    reg_id:"auth>RegisterUser"
                });

                const save_auth = await this.auth_repository.save(auth);

                if(save_auth){
                    const detail = this.detail_repository.create({
                        user:save_user,
                        user_no:save_user.user_no,
                        addr_type:RegisterDto.addr_type,
                        addr:RegisterDto.addr,
                        lngx:RegisterDto.lngx,
                        laty:RegisterDto.laty,
                        reg_dt:Util.GetUtcDate(),
                        reg_id:"auth>RegisterUser"
                    });

                    const save_detail = await this.detail_repository.save(detail);

                    if(save_detail){
                        const userProfiledto:UserProfileDto={
                          user_no:save_user.user_no,
                          user_nm:save_user.user_nm,
                          login_channel:save_auth.login_channel,
                          token_id:save_auth.token_id,
                          addr_type:detail.addr_type,
                          addr:detail.addr,
                          lngx:detail.lngx,
                          laty:detail.laty,
                          reg_dt:save_user.reg_dt,
                        };

                        return userProfiledto;
                    }
                }
            }
        }

        return null;
    }








}
