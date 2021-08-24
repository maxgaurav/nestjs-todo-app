import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Redirect,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignedUrlGuard } from 'nestjs-url-generator';
import { HashEncryptService } from '../../services/hash-encrypt/hash-encrypt.service';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { LoginRegisteredUserInterceptor } from '../../interceptors/login-registered-user/login-registered-user.interceptor';

@Controller('auth/email/verify')
export class EmailVerificationController {
  constructor(
    private hashEncrypt: HashEncryptService,
    private userRepo: UserRepoService,
  ) {}

  @UseInterceptors(LoginRegisteredUserInterceptor)
  @Redirect('/dashboard')
  @Get()
  @UseGuards(SignedUrlGuard)
  public async verify(@Query('token') token: string) {
    const userId = parseFloat(await this.hashEncrypt.decrypt(token));
    if (isNaN(userId)) {
      throw new ForbiddenException();
    }
    return this.userRepo.markUserVerified(userId);
  }
}
