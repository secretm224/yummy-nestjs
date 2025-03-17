import { Controller ,Post,Get,Query,Res,Req,HttpException,HttpStatus, Body,Render } from '@nestjs/common';
// import * as path from 'path';
// import { LoggerService } from '../kafka/logger.service';
import { KafkaService } from 'src/kafka_producer/kafka.service';
import {AuthService} from './auth.service';
import * as jwt from 'jsonwebtoken'
import {Response,Request} from 'express'
import * as session from 'express-session';
import {RegisterUserDto} from './dto/register.user.dto';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly kafka_service:KafkaService,
        private readonly auth_service:AuthService,
        private readonly redisService:RedisService
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
            const accessTokenKey = `access_token:${uuidv4()}`;
            const refreshTokenKey = `refresh_token:${uuidv4()}`;

            if (accessTokenKey && access_token ) {
                await this.redisService.setValue(accessTokenKey,access_token);
            }
            
            if (refreshTokenKey && refresh_token) {
                await this.redisService.setValue(refreshTokenKey,refresh_token);
            }


            if(!!accessTokenKey){
                res.cookie('accessTokenKey',accessTokenKey,
                                                        {
                                                            httpOnly:true,
                                                            secure:false,
                                                            sameSite:true
                                                         });
            }

            //await this.redisService.setValue("",access_token);

            if(!!refreshTokenKey){
                res.cookie('refreshTokenKey',refreshTokenKey,
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
            
            const token_id = userinfo?.sub?.toString()??"";
            const user_detail = await this.auth_service.GetUserDetailInfo('kakao',token_id);
            req.session.user?.detail?.push({
                addr_type: user_detail?.addr_type ?? "",
                addr: user_detail?.addr ?? "",
                lngx: user_detail?.lngx ?? 0,
                laty: user_detail?.laty ?? 0,
            });

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
            //access_token = req.cookies['access_token'];
            const accessTokenKey = req.cookies.accessTokenKey;
            access_token = await this.redisService.getValue(accessTokenKey)??"";
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

                    const token_id = userinfo?.token_id??"";
                    const user_detail = await this.auth_service.GetUserDetailInfo('kakao',token_id);
                    req.session.user?.detail?.push({
                        addr_type: user_detail?.addr_type ?? "",
                        addr: user_detail?.addr ?? "",
                        lngx: user_detail?.lngx ?? 0,
                        laty: user_detail?.laty ?? 0,
                    });
                    
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
               //const refrech_token = req.cookies['refrech_token'];
               const refreshTokenKey = req.cookies.refreshTokenKey;
               const refrech_token = await this.redisService.getValue(refreshTokenKey);

               if(refrech_token){
                   const new_token = await this.auth_service.GetAccessTokenByRefreshToken(refrech_token);
                   if(new_token){
                    const new_access_token = new_token.access_token;
                    const new_refresh_token = new_token.refresh_token;
                    const payload = jwt.decode(new_token.id_token);
                    const accessTokenKey = `access_token:${uuidv4()}`;
                    const refreshTokenKey = `refresh_token:${uuidv4()}`;

                    if (accessTokenKey && new_access_token) {
                        await this.redisService.setValue(accessTokenKey,new_access_token);
                    }
                    
                    if (refreshTokenKey && new_refresh_token) {
                        await this.redisService.setValue(refreshTokenKey,new_refresh_token);
                    }

                    if(!!accessTokenKey){
                        res.cookie('accessTokenKey',accessTokenKey,
                                                                    {
                                                                        httpOnly:true,
                                                                        secure:false,
                                                                        sameSite:true
                                                                    });
                    }

                    if(!!refreshTokenKey){
                        res.cookie('refreshTokenKey',refreshTokenKey,
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

                        const token_id = userinfo?.sub?.toString()??"";
                        const user_detail = await this.auth_service.GetUserDetailInfo('kakao',token_id);
                        req.session.user?.detail?.push({
                            addr_type: user_detail?.addr_type ?? "",
                            addr: user_detail?.addr ?? "",
                            lngx: user_detail?.lngx ?? 0,
                            laty: user_detail?.laty ?? 0,
                        });

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
        //moon
        const accessTokenKey = req.cookies.accessTokenKey;
        this.redisService.deleteValue(accessTokenKey);

        const refreshTokenKey = req.cookies.refreshTokenKey;
        this.redisService.deleteValue(refreshTokenKey);
        //await this.redisService.deleteValue()
        
        req.session.destroy(() => {
            res.clearCookie('accessTokenKey');
            res.clearCookie('refreshTokenKey');
            res.redirect('/login');
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
            req.session.user?.detail?.push({
                addr_type: addr_detail.addr_type ?? "",
                addr: addr_detail.addr ?? "",
                lngx: addr_detail.lngx ?? 0,
                laty: addr_detail.laty ?? 0,
              });

            req.session.save(err => {
                if (err) console.error('세션 저장 실패:', err);
            });    
        }

     return res.json(addr_detail);
    }
}
