import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationController } from './email-verification.controller';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { HashEncryptService } from '../../services/hash-encrypt/hash-encrypt.service';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserModel } from '../../../databases/models/user.model';
import { ForbiddenException } from '@nestjs/common';

describe('EmailVerificationController', () => {
  let controller: EmailVerificationController;

  const urlGenerator: UrlGeneratorService = {} as any;
  const hasEncrypt: HashEncryptService = { decrypt: (value) => value } as any;
  const userRepo: UserRepoService = {
    markUserVerified: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerificationController],
      providers: [
        {
          provide: UrlGeneratorService,
          useValue: urlGenerator,
        },
        {
          provide: HashEncryptService,
          useValue: hasEncrypt,
        },
        {
          provide: UserRepoService,
          useValue: userRepo,
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EmailVerificationController>(
      EmailVerificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user with verified status', async () => {
    const decryptSpy = jest
      .spyOn(hasEncrypt, 'decrypt')
      .mockReturnValue(Promise.resolve('1'));
    const user: UserModel = {} as any;
    const markVerifiedSpy = jest
      .spyOn(userRepo, 'markUserVerified')
      .mockReturnValue(Promise.resolve(user));

    expect(await controller.verify('token')).toEqual(user);
    expect(decryptSpy).toHaveBeenCalledWith('token');
    expect(markVerifiedSpy).toHaveBeenCalledWith(1);
  });

  it('should throw forbidden error', async () => {
    const decryptSpy = jest
      .spyOn(hasEncrypt, 'decrypt')
      .mockReturnValue(Promise.resolve('nan'));

    let errorThrown = false;

    try {
      await controller.verify('token');
    } catch (err) {
      if (err instanceof ForbiddenException) {
        errorThrown = true;
      }
    }
    expect(decryptSpy).toHaveBeenCalledWith('token');
    expect(errorThrown).toEqual(true);
  });
});
