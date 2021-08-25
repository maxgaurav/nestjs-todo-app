import { Controller, Post, Redirect, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserModel } from '../../../databases/models/user.model';
import { LoginWebGuard } from '../../guards/login-web/login-web.guard';
import { AuthService } from '../../services/auth/auth.service';
import { WebGuard } from '../../guards/web/web.guard';

@Controller('auth')
export class LoginController {
  constructor(private authService: AuthService) {}

  @Redirect('/dashboard')
  @UseGuards(LoginWebGuard)
  @Post('login')
  public login(@Req() request: Request) {
    this.authService.mapSessionWithUser(
      request.session as any,
      request.user as UserModel,
    );
    return request.user;
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
