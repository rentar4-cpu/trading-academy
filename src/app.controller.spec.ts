import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should expose the landing route', () => {
      expect(appController.openLanding()).toBeUndefined();
    });

    it('should expose the Android-safe game route', () => {
      expect(appController.openGameIndex()).toBeUndefined();
    });
  });
});
