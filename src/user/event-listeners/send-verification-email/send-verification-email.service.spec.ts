import { Test, TestingModule } from '@nestjs/testing';
import { SendVerificationEmailService } from './send-verification-email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';
import { UserModel } from '../../../databases/models/user.model';
import { UserRegisteredEvent } from '../../../system-events/user-registered/user-registered.event';
import { EmailVerificationController } from '../../../auth/controllers/email-verification/email-verification.controller';
import * as moment from 'moment';
import * as mockdate from 'mockdate';

describe('SendVerificationEmailService', () => {
  let service: SendVerificationEmailService;

  const mailService: MailerService = {
    sendMail: (value) => value,
  } as any;
  const urlGenerator: UrlGeneratorService = {
    signedControllerUrl: (value) => value,
  } as any;
  const hashService: HashEncryptService = {
    encrypt: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendVerificationEmailService,
        {
          provide: MailerService,
          useValue: mailService,
        },
        {
          provide: UrlGeneratorService,
          useValue: urlGenerator,
        },
        {
          provide: HashEncryptService,
          useValue: hashService,
        },
      ],
    }).compile();

    service = module.get<SendVerificationEmailService>(
      SendVerificationEmailService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send verification email', async () => {
    const encryptSpy = jest
      .spyOn(hashService, 'encrypt')
      .mockReturnValue(Promise.resolve('encrypt'));

    const signedSpy = jest
      .spyOn(urlGenerator, 'signedControllerUrl')
      .mockReturnValue('singedUrl');

    const mailSendSpy = jest
      .spyOn(mailService, 'sendMail')
      .mockReturnValue(Promise.resolve(true));
    mockdate.set(new Date('2021-01-01 00:00:00'));

    const user: UserModel = { id: 1, email: 'test@test.com' } as any;

    expect(await service.sendVerificationEmail(new UserRegisteredEvent(user)));
    expect(encryptSpy).toHaveBeenCalledWith(user.id.toString());
    expect(signedSpy).toHaveBeenCalledWith({
      controller: EmailVerificationController,
      controllerMethod: EmailVerificationController.prototype.verify,
      expirationDate: moment().add(1, 'days').toDate(),
      query: { token: 'encrypt' },
    });
    expect(mailSendSpy).toHaveBeenCalledWith({
      to: user.email,
      subject: 'Verification Email',
      template: './emails/verification-email',
      context: { user, signedUrl: 'singedUrl' },
    });
  });
});
