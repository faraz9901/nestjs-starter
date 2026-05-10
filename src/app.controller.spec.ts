import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { describe, it, beforeEach, expect } from '@jest/globals';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Server Running!"', () => {

      const response = appController.getHello();

      expect(response).toEqual(
        expect.objectContaining({
          data: null,
          status: 200,
          message: 'Server Running...',
        }),
      );
    });
  });
});