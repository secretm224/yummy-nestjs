import { Test, TestingModule } from '@nestjs/testing';
import { StoreLocationInfoService } from './storeLocation.service';

describe('ZeroPossibleService', () => {
  let service: StoreLocationInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreLocationInfoService],
    }).compile();

    service = module.get<StoreLocationInfoService>(StoreLocationInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
