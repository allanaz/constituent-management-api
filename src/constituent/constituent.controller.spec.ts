import { Test, TestingModule } from '@nestjs/testing';
import { ConstituentController } from './constituent.controller';

describe('ConstituentController', () => {
  let controller: ConstituentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstituentController],
    }).compile();

    controller = module.get<ConstituentController>(ConstituentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
