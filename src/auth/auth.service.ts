import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import * as path from 'path';
//import { LoggerService } from '../kafka/logger.service';



@Injectable()
export class AuthService {
    //constructor(private readonly logger_service:LoggerService){}
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
            const redirect = "http://secretm-yummy.com:3000/login/login.html";
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
                return kakao_token.data;
            }else{
                throw new HttpException("kakao token data is empty",HttpStatus.BAD_REQUEST);
            }

        }catch(error){
            console.error('kakaoapi error = '+error.response?.data);
        }
    }
}
