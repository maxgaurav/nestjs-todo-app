import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { HashEncryptService } from '../hash-encrypt/hash-encrypt.service';
import { UserModel } from '../../../databases/models/user.model';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let hashService: HashEncryptService;

  const configService: ConfigService = {} as any;

  const userRepo: UserRepoService = {
    findByEmail: (value) => value,
    findOrFail: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepoService,
          useValue: userRepo,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        HashEncryptService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    hashService = module.get<HashEncryptService>(HashEncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user when user is found and hash passes', async () => {
    const user: UserModel = {
      id: 1,
      email: 'email@email.com',
      password: await hashService.createHash('password'),
    } as any;
    const findByEmailSpy = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(user));

    expect(await service.validateForPassword(user.email, 'password')).toEqual(
      user,
    );
    expect(findByEmailSpy).toHaveBeenCalledWith(user.email);
  });

  it('should return null when user is not found', async () => {
    const user: UserModel = {
      id: 1,
      email: 'email@email.com',
      password: await hashService.createHash('password'),
    } as any;

    const findByEmailSpy = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    expect(await service.validateForPassword(user.email, 'password')).toEqual(
      null,
    );
    expect(findByEmailSpy).toHaveBeenCalledWith(user.email);
  });

  it('should return null when password hash do not match', async () => {
    const user: UserModel = {
      id: 1,
      email: 'email@email.com',
      password: await hashService.createHash('passwordNotMatch'),
    } as any;

    const findByEmailSpy = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(user));

    expect(await service.validateForPassword(user.email, 'password')).toEqual(
      null,
    );
    expect(findByEmailSpy).toHaveBeenCalledWith(user.email);
  });

  it('should return the user model form service for the user id', async () => {
    const user: UserModel = {
      id: 1,
      email: 'email@email.com',
      password: 'passwordHash',
    } as any;

    const findByIdOrFailSpy = jest
      .spyOn(userRepo, 'findOrFail')
      .mockReturnValueOnce(Promise.resolve(user));

    expect(await service.getLoggedInUser(user.id)).toEqual(user);
    expect(findByIdOrFailSpy).toHaveBeenCalledWith(user.id);
  });

  it('should map user to session', async () => {
    const session = { save: (value) => value } as any;

    const saveSpy = jest
      .spyOn(session, 'save')
      .mockImplementation((callback: () => void) => {
        callback();
      });

    const user: UserModel = { id: 1 } as any;
    await service.mapSessionWithUser(session, user);
    expect(session).toEqual(
      expect.objectContaining({
        auth: { isAuth: true, userId: user.id },
      }),
    );
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should throw error when mapping of user to session fails to be saved', async () => {
    const session = { save: (value) => value } as any;

    const saveSpy = jest
      .spyOn(session, 'save')
      .mockImplementation((callback: (err: string) => void) => {
        callback('errorPassed');
      });

    const user: UserModel = { id: 1 } as any;
    let errorThrown = false;
    try {
      await service.mapSessionWithUser(session, user);
    } catch (err) {
      if (err === 'errorPassed') {
        errorThrown = true;
      }
    }
    expect(saveSpy).toHaveBeenCalled();
    expect(errorThrown).toEqual(true);
  });
});
