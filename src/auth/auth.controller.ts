import { Controller ,Post,Get,Query,Res,Req,HttpException,HttpStatus, Body,Render } from '@nestjs/common';
// import * as path from 'path';
// import { LoggerService } from '../kafka/logger.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import {AuthService} from './auth.service';
import * as jwt from 'jsonwebtoken'
import {Response,Request} from 'express'

@Controller('auth')
export class AuthController {

    constructor(
        private readonly kafka_service:KafkaService,
        private readonly auth_service:AuthService
    ){}

    
    @Post('kakao/callback')
     async GetKaKaoAuthCode(@Body("code") code:string, @Res() res:Response){
        const logMessage: any = {
                                    log_type: "auth",
                                    log_channel: "kakao",
                                    data_type: "code",
                                    data_value: code,
                                };

        await this.kafka_service.sendMessage('yummy-store',logMessage);

       if(!!code){
            const kakao_token = await this.auth_service.GetKaKaoToken(code);
           // console.log('kakao kakao_token = '+kakao_token);
            const token_logMessage: any = {
                                        log_type: "auth",
                                        log_channel: "kakao",
                                        data_type: "token",
                                        data_value: kakao_token,
                                    };
                                    
            await this.kafka_service.sendMessage('yummy-store',token_logMessage);
            
            const access_token = kakao_token.access_token;
            const refresh_token = kakao_token.refresh_token;
            const payload = jwt.decode(kakao_token.id_token);
            
            if(!!access_token){
                res.cookie('access_token',access_token,
                                                        {
                                                            httpOnly:true,
                                                            secure:false,
                                                            sameSite:true
                                                         });
            }


            if(!!refresh_token){
                res.cookie('refrech_token',refresh_token,
                                                         {
                                                            httpOnly:true,
                                                            secure:false,
                                                            sameSite:true
                                                         });
            }

            res.json({kakao_access_token:access_token,
                      kakao_payload:payload}) 
            
       }else{
            return new HttpException('kakao auth failed',HttpStatus.BAD_REQUEST);
       }
    }

    @Post("kakao/userinfo")
    async GetUserInfoByAccessToken(@Body("access_token") access_token:string,
                                   @Req() req: Request,
                                   @Res() res:Response){

       if(!access_token){
            access_token = req.cookies['access_token'];
       }                                    
                                    
       if(!!access_token){
            const check_token = await this.auth_service.CheckAccessTokenInfo(access_token);

            if(check_token){
                const userinfo = await this.auth_service.GetKakaoUserInfo(access_token);
                if(userinfo){
                    const user_json = {
                        user: {
                          name: userinfo?.nickname || '',
                          picture: userinfo?.picture || ''
                        }
                      };
                      
                    if(!!user_json){
                        res.cookie('user',user_json,
                                                    {
                                                    httpOnly:true,
                                                    secure:false,
                                                    sameSite:true
                                                    });
                    }

                    return res.json({kakao_access_token:access_token,
                                     kakao_payload:userinfo}) 
                }else{
                    return new HttpException('get userinfo failed by access tokens',HttpStatus.BAD_REQUEST);
                }
            }else{
               const refrech_token = req.cookies['refrech_token'];
               if(refrech_token){
                   const new_token = await this.auth_service.GetAccessTokenByRefreshToken(refrech_token);
                   if(new_token){
                    const new_access_token = new_token.access_token;
                    const new_refresh_token = new_token.refresh_token;
                    const payload = jwt.decode(new_token.id_token);

                    if(!!new_access_token){
                        res.cookie('access_token',new_access_token,
                                                                {
                                                                    httpOnly:true,
                                                                    secure:false,
                                                                    sameSite:true
                                                                 });
                    }

                    if(!!new_refresh_token){
                        res.cookie('refrech_token',new_refresh_token,
                                                                    {
                                                                        httpOnly:true,
                                                                        secure:false,
                                                                        sameSite:true
                                                                    });
                    }

                  
                    const userinfo = payload as jwt.JwtPayload;
                    if(!!userinfo && !!userinfo.nickname && !!userinfo.picture){
                        const user_json = {
                            user: {
                              name: userinfo?.nickname || '',
                              picture: userinfo?.picture || ''
                            }
                          };
                        if(!!user_json){
                            res.cookie('user',user_json,
                                                        {
                                                            httpOnly:true,
                                                            secure:false,
                                                            sameSite:true
                                                        });
                        }
                    }

                   return res.json({kakao_access_token:new_access_token,
                                    kakao_payload:payload});

                   }else{
                       return new HttpException('refresh token failed',HttpStatus.BAD_REQUEST);
                   }
                }
            }
        } else{
            return new HttpException('access tokens is empty',HttpStatus.BAD_REQUEST);
        }
    }

    // @Post('logout')
    // logout(@Res() res: Response) {
    //   // 쿠키 삭제
    //   res.clearCookie('access_token');
    //   res.redirect('/login');
    // }

}
