import { Test, TestingModule } from '@nestjs/testing';
import { UserRepoService } from './user-repo.service';
import { UserModel } from '../../../databases/models/user.model';
import { getModelToken } from '@nestjs/sequelize';
import { EmptyResultError } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';
import { EventRegisterCallbackService } from '../../../common/services/event-register-callback/event-register-callback.service';
import { SystemEvents } from '../../../system-events/system-events';

describe('UserRepoService', () => {
  let service: UserRepoService;

  const model: typeof UserModel = {
    findOne: (value) => value,
    findByPk: (value) => value,
    build: (value) => value,
  } as any;

  const eventEmitter: EventEmitter2 = { emitAsync: (value) => value } as any;
  const hashService: HashEncryptService = {
    createHash: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepoService,
        {
          provide: getModelToken(UserModel),
          useValue: model,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
        {
          provide: HashEncryptService,
          useValue: hashService,
        },
        EventRegisterCallbackService,
      ],
    }).compile();

    service = module.get<UserRepoService>(UserRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user model by email when found', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findOneSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(await service.findByEmail(userModel.email, transaction)).toEqual(
      userModel,
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userModel.email },
      transaction,
    });
  });

  it('should return null when find by email fails to find user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findOneSpy = jest
      .spyOn(model, 'findOne')
      .mockReturnValueOnce(Promise.resolve(undefined));

    const transaction = null;

    expect(await service.findByEmail(userModel.email, transaction)).toEqual(
      null,
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { email: userModel.email },
      transaction,
    });
  });

  it('should find the user by id', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findSpy = jest
      .spyOn(model, 'findByPk')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(await service.findOrFail(userModel.id, transaction)).toEqual(
      userModel,
    );

    expect(findSpy).toHaveBeenCalledWith(userModel.id, { transaction });
  });

  it('should return user when find by email results in user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findByEmailSpy = jest
      .spyOn(service, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(userModel));

    const transaction = null;

    expect(
      await service.findByEmailOrFail(userModel.email, transaction),
    ).toEqual(userModel);

    expect(findByEmailSpy).toHaveBeenCalledWith(userModel.email, transaction);
  });

  it('should throw exception when find by email or fail does not return user', async () => {
    const userModel: UserModel = { id: 1, email: 'email@email.com' } as any;
    const findByEmailSpy = jest
      .spyOn(service, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const transaction = null;
    let errorMapped = false;

    try {
      await service.findByEmailOrFail(userModel.email, transaction);
    } catch (err) {
      if (err instanceof EmptyResultError) {
        errorMapped = true;
      }
    }
    expect(errorMapped).toEqual(true);
    expect(findByEmailSpy).toHaveBeenCalledWith(userModel.email, transaction);
  });

  it('should create user and trigger user registered event', async () => {
    const userModel: UserModel = {
      setAttributes: (value) => value,
      save: (value) => value,
      reload: (value) => value,
      id: 1,
    } as any;

    const buildSpy = jest.spyOn(model, 'build').mockReturnValue(userModel);
    const setAttributeSpy = jest
      .spyOn(userModel, 'setAttributes')
      .mockReturnValue(userModel);

    const saveSpy = jest
      .spyOn(userModel, 'save')
      .mockReturnValue(Promise.resolve(userModel));

    const reloadSpy = jest
      .spyOn(userModel, 'reload')
      .mockReturnValue(Promise.resolve(userModel));

    const emitEventSpy = jest
      .spyOn(eventEmitter, 'emitAsync')
      .mockReturnValue(Promise.resolve(true) as any);

    const hashSpy = jest
      .spyOn(hashService, 'createHash')
      .mockReturnValue(Promise.resolve('hash'));

    const transaction = null;
    expect(
      await service.createUser(
        { email: 'test@test.com', password: 'password' },
        transaction,
      ),
    ).toEqual(userModel);

    expect(buildSpy).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(1, {
      email: 'test@test.com',
      password: 'password',
    });
    expect(setAttributeSpy).toHaveBeenNthCalledWith(2, {
      password: 'hash',
    });
    expect(hashSpy).toHaveBeenCalledWith('password');
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
    expect(reloadSpy).toHaveBeenCalledWith({ transaction });
    expect(emitEventSpy).toHaveBeenCalledWith(
      SystemEvents.UserRegistered,
      expect.anything(),
    );
  });

  it('should mark user as verified when user id is provided', async () => {
    const userModel: UserModel = {
      id: 1,
      setAttributes: (value) => value,
      save: (value) => value,
    } as any;
    const findSpy = jest
      .spyOn(service, 'findOrFail')
      .mockReturnValue(Promise.resolve(userModel));

    const setAttributeSpy = jest
      .spyOn(userModel, 'setAttributes')
      .mockReturnValue(userModel);

    const saveSpy = jest
      .spyOn(userModel, 'save')
      .mockReturnValue(Promise.resolve(userModel));

    const transaction = null;

    expect(await service.markUserVerified(1, transaction)).toEqual(userModel);
    expect(findSpy).toHaveBeenCalledWith(1, transaction);
    expect(setAttributeSpy).toHaveBeenCalledWith({ is_verified: true });
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
  });
});
