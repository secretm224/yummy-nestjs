import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as expressLayouts from 'express-ejs-layouts';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /* 정적 파일 제공 (public 폴더 서빙) */ 
  app.use(cookieParser());
  app.enableCors({
    credentials:true
  });
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // EJS 템플릿 경로
  app.setViewEngine('ejs'); // EJS 설정
  

  app.use(expressLayouts);
  app.set('layout', 'layouts/layout'); // 기본 레이아웃 설정
  app.set('layout extractScripts', true); // <%- script %> 태그 사용 가능
  app.set('layout extractStyles', true); // <%- style %> 태그 사용 가능
  //app.set('view options', { layout: 'layouts/layout' }); // 기본 레이아웃 설정

  await app.listen(process.env.PORT ?? 5176);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});