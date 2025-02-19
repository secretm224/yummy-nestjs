import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import * as path from 'path';
import { UserRepository } from './user.repository';




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

            console.log("kakao token2="+kakao_token);

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

        console.log('access_token = '+access_token);

        try {
            const url = 'https://kapi.kakao.com/v2/user/me';
         
            const header = {headers:{
                'Authorization': `Bearer ${access_token}`, // ✅ 올바른 토큰 형식 (공백 포함)
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
}
