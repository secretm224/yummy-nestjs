import { Controller ,Get,Query,Res,HttpException,HttpStatus } from '@nestjs/common';
import {Response} from 'express'
import * as path from 'path';

import { LoggerService } from '../kafka/logger.service';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly logger_service:LoggerService,
        private readonly auth_service:AuthService
    ){}

    // private readonly api_key = "2fcfa96247ae04a4ad26cd853f1e5551";

    @Get('kakao/callback')
    async GetKaKaoAuthCode(@Query('code')code:string,@Res() res : Response){
        console.log('kakao callback code = '+code);
        const logMessage: any = {
                                    log_type: "auth",
                                    log_channel: "kakao",
                                    data_type: "code",
                                    data_value: code,
                                };

        await this.logger_service.logTokafka('yummy-store',logMessage);

       if(!!code){

        const kakao_token = await this.auth_service.GetKaKaoToken(code);
        console.log('kakao kakao_token = '+kakao_token);
        const token_logMessage: any = {
                                    log_type: "auth",
                                    log_channel: "kakao",
                                    data_type: "token",
                                    data_value: kakao_token,
                                };
        
           await this.logger_service.logTokafka('yummy-store',token_logMessage);

           //return res.redirect('/public/login/login.html');

       }else{
            return new HttpException('kakao auth failed',HttpStatus.BAD_REQUEST);
       }
    }
}
