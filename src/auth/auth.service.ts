import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import * as path from 'path';
import { UserRepository } from './user.repository';
// import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private readonly userrepository:UserRepository){}
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
                this.userrepository.SaveUser(kakao_token);
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

            if(!!nickname && !!image){
                return {nickname:nickname,picture:image};
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
        }catch(error){
            check_token = null;
            is_token = false;
        }

        if(!!check_token && check_token.status === HttpStatus.OK){
            is_token = true;
        }else {
            is_token = false;
        }

        return is_token;
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
}
