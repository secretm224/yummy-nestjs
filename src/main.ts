import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
   // 정적 파일 제공 (public 폴더 서빙)
   app.useStaticAssets(join(__dirname, '..', 'src', 'public'));

  await app.listen(process.env.PORT ?? 3000);

}

bootstrap();
