import { Test, TestingModule } from '@nestjs/testing';
import { VocaService } from './voca.service';

describe('VocaService', () => {
  let service: VocaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocaService],
    }).compile();

    service = module.get<VocaService>(VocaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
