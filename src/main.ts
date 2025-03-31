import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as expressLayouts from 'express-ejs-layouts';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
	
	app.use(
		session(
			{
				secret: 'my-secret-key',
				resave: false,
				saveUninitialized: false, // 필요할 때만 세션 생성
				cookie: {
					secure: false, // HTTPS 환경이면 true로 변경
					httpOnly: true,
					maxAge: 1000 * 60 * 60 * 24, // 1일 유지
				}
			}
		)
	);

	app.use(passport.initialize());
	app.use(passport.session());
	app.useBodyParser('json'); // express.json() 대신 사용

	//전체 페이지에서 사용할 수 있는 변수 설정
	app.use((req, res, next) => {
		res.locals.user = req.session?.user || null;
		res.locals.error = req.query.error || null;
		res.locals.currentPage = req.path;

		/* API url 을 전역적으로 사용하기 위함. */
		res.locals.kakao_redirect_uri = process.env.KAKAO_REDIRECT_URL;
		res.locals.apiBaseUrl = process.env.FRONT_API_BASE_URL;
		next();
	});

   	// ✅ Swagger 설정 추가
	const config = new DocumentBuilder()
		.setTitle('Yummy API')
		.setDescription('Yummy 서비스 API 문서')
		.setVersion('1.0')
		.addBearerAuth() // JWT 인증 추가 (옵션)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	await app.listen(process.env.PORT ?? 5176);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});