import { Controller, Get, Render } from '@nestjs/common';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { LoginController } from './auth/controllers/login/login.controller';

@Controller()
export class AppController {
  constructor(private readonly urlGenerator: UrlGeneratorService) {}

  @Get()
  @Render('login')
  loginForm(): { loginUrl: string } {
    return {
      loginUrl: this.urlGenerator.generateUrlFromController({
        controller: LoginController,
        controllerMethod: LoginController.prototype.login,
      }),
    };
  }
}
