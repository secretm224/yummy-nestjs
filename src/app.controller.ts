import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  getYummyMap(@Res() res: Response) {
    // yummymap.html 파일 반환
    res.sendFile(join(process.cwd(), 'public', 'yummyMap.html')); // ✅ dist가 아닌 프로젝트 루트를 기준으로 찾음
  }
}
