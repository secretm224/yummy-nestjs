import { Test, TestingModule } from '@nestjs/testing';
import { ZeroPossibleService } from './zeroPossible.service';

describe('ZeroPossibleService', () => {
  let service: ZeroPossibleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZeroPossibleService],
    }).compile();

    service = module.get<ZeroPossibleService>(ZeroPossibleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
