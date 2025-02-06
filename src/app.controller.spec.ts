import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  //테스트 코드 작성
  // // describe('root', () => {
  // //   it('should return "Hello World!"', () => {
  // //     expect(appController.getHello()).toBe('Hello World!');
  // //   });
  // // });
});
