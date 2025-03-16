import { Controller, Get, Res ,Render ,Req} from '@nestjs/common';
import { AppService } from './app.service';
import { Response , Request } from 'express';
import { join } from 'path';
import { RedisService } from './redis/redis.service';
import { StoreTypeMajorService } from './store_type_major/storeTypeMajor.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly RedisService: RedisService,
    private readonly storeTypeMajorService: StoreTypeMajorService
  ) {}

  // @Get('/')
  // getYummyMap(@Res() res: Response) {
  //   // yummymap.html 파일 반환
  //   res.sendFile(join(process.cwd(), 'public', 'yummyMap.html')); // ✅ dist가 아닌 프로젝트 루트를 기준으로 찾음
  // }

  @Get('/')
  @Render('yummymap') 
  getYummyMap(@Req() req: Request) {
      return {
        title: '가야할 지도',
        //css: '<link rel="stylesheet" href="/css/yummy.css" type="text/css">',
        error: req.query.error || null // page에 error가 있으면 error를 넘겨줌
    };
  }

  @Get('/registerStore')
  @Render('registerStore') 
  async registerStore(@Req() req: Request) {
    
    try {

        //const storeTypes = await this.RedisService.getMajorCategories();
        const storeTypes = await this.storeTypeMajorService.findAll();

        console.log(storeTypes);

        return {
            title: '상점 등록하기',
            storeTypes, /* 조회한 데이터를 템플릿에 전달 */ 
            error: req.query.error || null
        };

    } catch(err) {
        console.error('Error fetching store types:', err);
        return { title: '상점 등록하기', storeTypes: [], error: '데이터를 불러올 수 없습니다.:' };
    }
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
