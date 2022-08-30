import { Test, TestingModule } from '@nestjs/testing';
import { VocaController } from './voca.controller';
import { VocaService } from './voca.service';

describe('VocaController', () => {
  let controller: VocaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocaController],
      providers: [VocaService],
    }).compile();

    controller = module.get<VocaController>(VocaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
