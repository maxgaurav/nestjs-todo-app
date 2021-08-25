import {
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserModel } from '../../../databases/models/user.model';
import { LoginWebGuard } from '../../guards/login-web/login-web.guard';
import { AuthService } from '../../services/auth/auth.service';
import { WebGuard } from '../../guards/web/web.guard';
import { IntendManagerService } from '../../../session-manager/services/intend-manager/intend-manager.service';

@Controller('auth')
export class LoginController {
  /**
   * Default redirect url
   * @protected
   */
  protected defaultRedirectUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private intendManager: IntendManagerService,
  ) {}

  @UseGuards(LoginWebGuard)
  @Post()
  public async login(@Req() request: Request, @Res() response: Response) {
    await this.authService.mapSessionWithUser(
      request.session as any,
      request.user as UserModel,
    );

    const redirectUrl = this.getRedirectUrl(request);
    return new Promise<void>((res, rej) => {
      request.session.save((err) => {
        if (!!err) {
          rej(err);
          return;
        }
        response.redirect(redirectUrl);
        res();
      });
    });
  }

  /**
   * Returns the redirect url
   * @param request
   */
  public getRedirectUrl(request: Request): string {
    const intendUrl = this.intendManager.getUrl(request);

    if (!!intendUrl) {
      this.intendManager.setUrl(request, null);
      return intendUrl;
    }

    return this.defaultRedirectUrl;
  }

  @Redirect('/')
  @UseGuards(WebGuard)
  @Post('logout')
  public logout(@Req() request: Request) {
    return new Promise<boolean>((res, rej) =>
      request.session.regenerate((err) => {
        if (err) {
          rej(err);
          return;
        }

        res(true);
      }),
    );
  }
}
