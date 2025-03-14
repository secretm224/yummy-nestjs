import { Controller ,Post,Get,Query,Res,Req,HttpException,HttpStatus, Body,Render } from '@nestjs/common';
// import * as path from 'path';
// import { LoggerService } from '../kafka/logger.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import {AuthService} from './auth.service';
import * as jwt from 'jsonwebtoken'
import {Response,Request} from 'express'
import * as session from 'express-session';
import {RegisterUserDto} from './dto/register.user.dto';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly kafka_service:KafkaService,
        private readonly auth_service:AuthService
    ){}

    
    @Post('kakao/callback')
     async GetKaKaoAuthCode(@Body("code") code:string, @Res() res:Response, @Req() req:Request){
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

            const userinfo = payload as jwt.JwtPayload;
            let is_admin = false;
            if(!!userinfo && !! userinfo.nickname){
               if(userinfo.nickname === '문호석' || userinfo.nickname === '신승환'){
                   is_admin = true;
               }
            }

            req.session.user = {
                name: userinfo?.nickname || 'GUEST',
                picture: userinfo?.picture || '',
                is_admin: is_admin,
                login_channel: 'kakao',
                token_id:userinfo?.sub?.toString() ?? "0",
                detail:[]
            };
            
            console.log('세션에 저장된 유저 정보:', req.session.user);
            
            req.session.save(err => {
                if (err) console.error('세션 저장 실패:', err);
            });

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
                    // const user_json = {
                    //     user: {
                    //       name: userinfo?.nickname || '',
                    //       picture: userinfo?.picture || ''
                    //     }
                    //   };
                      
                    // if(!!user_json){
                    //     res.cookie('user',user_json,
                    //                                 {
                    //                                     httpOnly:true,
                    //                                     secure:false,
                    //                                     sameSite:true
                    //                                 });
                    // }
                    let is_admin = false;
                    if(!!userinfo && !! userinfo.nickname){
                       if(userinfo.nickname === '문호석' || userinfo.nickname === '신승환'){
                           is_admin = true;
                       }
                    }

                    req.session.user = {
                        name: userinfo?.nickname || 'GUEST',
                        picture: userinfo?.picture || '',
                        is_admin: is_admin,
                        login_channel: 'kakao',
                        token_id:userinfo?.token_id,
                        detail:[]
                    };
                    
                    //console.log('세션에 저장된 유저 정보:', req.session.user);
                    req.session.save(err => {
                        if (err) console.error('세션 저장 실패:', err);
                    });

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

                        // if(!!user_json){
                        //     res.cookie('user',user_json,
                        //                                 {
                        //                                     httpOnly:true,
                        //                                     secure:false,
                        //                                     sameSite:true
                        //                                 });
                        // }
                        let is_admin = false;
                        if(!!userinfo && !! userinfo.nickname){
                           if(userinfo.nickname === '문호석' || userinfo.nickname === '신승환'){
                               is_admin = true;
                           }
                        }

                        req.session.user = {
                            name: userinfo?.nickname || 'GUEST',
                            picture: userinfo?.picture || '',
                            is_admin: is_admin,
                            login_channel: 'kakao',
                            token_id:userinfo?.sub?.toString() ?? "0",
                            detail:[]
                        };

                        //console.log('세션에 저장된 유저 정보:', req.session.user);
                        req.session.save(err => {
                            if (err) console.error('세션 저장 실패:', err);
                        });        
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

    @Get('session')
    async getUserInfoBySession(@Req() req: Request) {
        return req.session.user ? req.session.user :{error_code :"999",error_msg:"session data empty"};
    }

    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.user = undefined;
        
        req.session.destroy(() => {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.redirect('/');
        });
    }


    @Post('AddUserDetail')
    async AddUserDetail(@Res() res:Response, @Req() req:Request){
        const userProfiledto:RegisterUserDto={
            user_nm:req.session.user?.name ?? "",
            login_channel:req.session.user?.login_channel ?? "",
            token_id:req.session.user?.token_id ?? "",
            addr_type:req.body.address_type,
            addr:req.body.address,
            lngx:0,
            laty:0
        }

        const addr_detail = await this.auth_service.RegisterUserWithCoordinate(userProfiledto);


        if(addr_detail){
            const detail = [{}]
            //req.session.user?.detail
        }

        return addr_detail;
    }
}
