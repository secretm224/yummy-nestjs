import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import * as path from 'path';
import { UserRepository } from './user.repository';
import { access } from 'fs';




@Injectable()
export class AuthService {
    constructor(private readonly userrepository:UserRepository){}
    private readonly api_key = "2fcfa96247ae04a4ad26cd853f1e5551";

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
            const url = "https://kauth.kakao.com/oauth/token";
            //const redirect ="http://secretm-yummy.com:3000/auth/kakao/callback";
            const redirect = 'http://secretm-yummy.com:3000/login/login.html';
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

        //access token 유효성 체크 추가 
        //access token 으로 id 조회 
        //console.log('access_token = '+access_token);
        try {

            const check_url = "https://kapi.kakao.com/v1/user/access_token_info";
            const check_header = {headers:{'Authorization': `Bearer ${access_token}`}};
            const check_token = await axios.get(check_url,check_header);
            // console.log('check token = '+check_token);
            
            //token 만료
            if(check_token.status != HttpStatus.OK){
            // 토큰 재발급 로직을 태운다
            }

            const url = 'https://kapi.kakao.com/v2/user/me';
            const header = {headers:{
                'Authorization': `Bearer ${access_token}`, 
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }};
            
            const data = new URLSearchParams({
                property_keys: '["kakao_account.profile.nickname","kakao_account.profile.thumbnail_image"]'
            });

            const userinfo = await axios.post(url, data, header);
            // console.log(userinfo.data);
            // console.log(userinfo.data.kakao_account.profile.nickname);
            // console.log(userinfo.data.kakao_account.profile.thumbnail_image_url);

            const nickname = userinfo.data.kakao_account.profile.nickname;
            const image = userinfo.data.kakao_account.profile.thumbnail_image_url;

            if(!!nickname && !!image){
                return {nickname:nickname,image:image};
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

        const url = 'https://kapi.kakao.com/v1/user/access_token_info';
        const header = {headers:{'Authorization': `Bearer ${access_token}`}};
        const check_token = await axios.get(url,header);

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

    async GetAccessTokenByRefreshToken(access_token:string , refresh_token:string){
        //	https://kauth.kakao.com/oauth/token
        if(!access_token || !refresh_token){
            throw new HttpException('bad request',HttpStatus.BAD_REQUEST);
        }

        const url = "https://kauth.kakao.com/oauth/token";
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
                refresh_token:ax_token.data.access_token
            }
         }
    }
}
