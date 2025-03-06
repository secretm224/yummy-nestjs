import { Controller, Get, Res ,Render ,Req} from '@nestjs/common';
import { AppService } from './app.service';
import { Response , Request } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/')
  // getYummyMap(@Res() res: Response) {
  //   // yummymap.html 파일 반환
  //   res.sendFile(join(process.cwd(), 'public', 'yummyMap.html')); // ✅ dist가 아닌 프로젝트 루트를 기준으로 찾음
  // }

  @Get('/')
  @Render('yummymap') 
  getYummyMap(@Req() req: Request) {
      return {
        title: '가야할 지도도',
        //css: '<link rel="stylesheet" href="/css/yummy.css" type="text/css">',
        error: req.query.error || null // page에 error가 있으면 error를 넘겨줌
    };
  }


  @Get('login')
  @Render('login') 
  loginPage(@Req() req: Request) {
      return {
          title: '로그인 - YummyMap',
          css: '<link rel="stylesheet" href="/css/login.css">',
          error: req.query.error || null // page에 error가 있으면 error를 넘겨줌
      };
  }
}
