import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { LoginController } from './auth/controllers/login/login.controller';

describe('AppController', () => {
  let appController: AppController;

  const urlGenerator = { generateUrlFromController: (value) => value };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: UrlGeneratorService, useValue: urlGenerator }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return login form content', () => {
      const generateSpy = jest
        .spyOn(urlGenerator, 'generateUrlFromController')
        .mockReturnValue('loginUrl');

      expect(appController.loginForm()).toEqual({ loginUrl: 'loginUrl' });
      expect(generateSpy).toHaveBeenCalledWith({
        controller: LoginController,
        controllerMethod: LoginController.prototype.login,
      });
    });
  });
});
