import { Module } from '@nestjs/common';
import { UserRepoService } from './services/user-repo/user-repo.service';
import { ModelBootstrapModule } from '../databases/model-bootstrap/model-bootstrap.module';
import { SendVerificationEmailService } from './event-listeners/send-verification-email/send-verification-email.service';
import { UniqueEmailValidatorService } from './validators/unique-email-validator/unique-email-validator.service';

@Module({
  imports: [ModelBootstrapModule.register()],
  providers: [
    UserRepoService,
    SendVerificationEmailService,
    UniqueEmailValidatorService,
  ],
})
export class UserModule {}
