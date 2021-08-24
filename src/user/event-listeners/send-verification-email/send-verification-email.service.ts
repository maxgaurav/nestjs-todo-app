import { Injectable } from '@nestjs/common';
import { UserRegisteredEvent } from '../../../system-events/user-registered/user-registered.event';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEvents } from '../../../system-events/system-events';
import { MailerService } from '@nestjs-modules/mailer';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { EmailVerificationController } from '../../../auth/controllers/email-verification/email-verification.controller';
import * as moment from 'moment';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';

@Injectable()
export class SendVerificationEmailService {
  constructor(
    private mailService: MailerService,
    private urlGenerator: UrlGeneratorService,
    private hasEncrypt: HashEncryptService,
  ) {}

  @OnEvent(SystemEvents.UserRegistered)
  public async sendVerificationEmail(event: UserRegisteredEvent) {
    const encryptedContent = await this.hasEncrypt.encrypt(
      event.userModel.id.toString(),
    );
    const signedUrl = await this.urlGenerator.signedControllerUrl({
      controller: EmailVerificationController,
      controllerMethod: EmailVerificationController.prototype.verify,
      expirationDate: moment().add(1, 'days').toDate(),
      query: { token: encryptedContent },
    });

    return this.mailService.sendMail({
      to: event.userModel.email,
      subject: 'Verification Email',
      template: './emails/verification-email',
      context: { user: event.userModel, signedUrl },
    });
  }
}
