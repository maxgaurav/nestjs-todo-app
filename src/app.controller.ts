import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { LoginController } from './auth/controllers/login/login.controller';
import { SessionErrorValidationInterceptor } from './session-manager/interceptors/session-error-validation/session-error-validation.interceptor';
import { OldInputsInterceptor } from './session-manager/interceptors/old-inputs/old-inputs.interceptor';
import { RedirectIfAuthenticatedInterceptor } from './auth/interceptors/redirect-if-authenticated/redirect-if-authenticated.interceptor';

@UseInterceptors(SessionErrorValidationInterceptor, OldInputsInterceptor)
@Controller()
export class AppController {
  constructor(private readonly urlGenerator: UrlGeneratorService) {}

  @UseInterceptors(RedirectIfAuthenticatedInterceptor)
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
