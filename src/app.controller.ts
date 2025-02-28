import { Controller, Get, Res ,Render ,Req} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getYummyMap(@Res() res: Response) {
    // yummymap.html 파일 반환
    res.sendFile(join(process.cwd(), 'public', 'yummyMap.html')); // ✅ dist가 아닌 프로젝트 루트를 기준으로 찾음
  }

  @Get('login')
  @Render('login') 
  loginPage() {
      return {
          title: '로그인 - YummyMap',
          css: '<link rel="stylesheet" href="/css/login.css">'
      };
  }

  // @Get('*')
  // async setUser(@Req() req, @Res() res, next: Function) {
  //   const user = req.cookies['user'];
  //   if (!user) {
  //     res.redirect('/login');
  //   }

  //   //console.log(JSON.stringify(user));
  //   // res.json(JSON.stringify(user));
  //   //return res.render('index', { user });
  //   // console.log('req.url = '+req.url);
  // }
}
