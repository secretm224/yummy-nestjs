import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as expressLayouts from 'express-ejs-layouts';
import * as session from 'express-session';
import * as passport from 'passport';

// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const redisClient = createClient({ url: 'redis://localhost:6379' });
  // redisClient.connect().catch(console.error);


  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials:true
  });
  
  /* 정적 파일 제공 (public 폴더 서빙) */ 
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // EJS 템플릿 경로
  app.setViewEngine('ejs'); // EJS 설정
  
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout'); // 기본 레이아웃 설정
  app.set('layout extractScripts', true); // <%- script %> 태그 사용 가능
  app.set('layout extractStyles', true); // <%- style %> 태그 사용 가능
  
  app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false, // 필요할 때만 세션 생성
    cookie: {
      secure: false, // HTTPS 환경이면 true로 변경
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1일 유지
    }
  }));

  // app.use(session({
  //   store: new RedisStore({ client: redisClient, disableTouch: true }), // Redis 저장소 사용
  //   secret: 'my-secret-key',
  //   resave: false,
  //   saveUninitialized: false,  // ✅ 필요할 때만 세션 생성
  //   cookie: {
  //     secure: false, // HTTPS 환경이면 true로 변경
  //     httpOnly: true,
  //     maxAge: 1000 * 60 * 60 * 24 // 1일 유지
  //   }
  // }));

  app.use(passport.initialize());
  app.use(passport.session());

  //전체 페이지에서 사용할 수 있는 변수 설정
  app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
  });

  await app.listen(process.env.PORT ?? 5176);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});