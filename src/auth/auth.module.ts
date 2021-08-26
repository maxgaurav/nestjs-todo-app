import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { HashEncryptService } from './services/hash-encrypt/hash-encrypt.service';
import { SessionStrategyService } from './stratergies/session-strategy/session-strategy.service';
import { LoginController } from './controllers/login/login.controller';
import { UserRepoService } from '../user/services/user-repo/user-repo.service';
import { ModelBootstrapModule } from '../databases/model-bootstrap/model-bootstrap.module';
import { WebGuard } from './guards/web/web.guard';
import { LoginWebGuard } from './guards/login-web/login-web.guard';
import { RegisterController } from './controllers/register/register.controller';
import { EmailVerificationController } from './controllers/email-verification/email-verification.controller';
import { IntendManagerService } from '../session-manager/services/intend-manager/intend-manager.service';

@Global()
@Module({
  imports: [ModelBootstrapModule.register()],
  providers: [
    AuthService,
    HashEncryptService,
    SessionStrategyService,
    UserRepoService,
    WebGuard,
    LoginWebGuard,
    IntendManagerService,
  ],
  controllers: [
    LoginController,
    RegisterController,
    EmailVerificationController,
  ],
  exports: [AuthService, HashEncryptService],
})
export class AuthModule {}
