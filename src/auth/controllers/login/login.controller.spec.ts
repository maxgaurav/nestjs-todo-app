import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { AuthService } from '../../services/auth/auth.service';
import { HashEncryptService } from '../../services/hash-encrypt/hash-encrypt.service';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { IntendManagerService } from '../../../session-manager/services/intend-manager/intend-manager.service';

describe('LoginController', () => {
  let controller: LoginController;
  let module: TestingModule;

  const intendManager: IntendManagerService = {
    getUrl: (value) => value,
    setUrl: (value) => value,
  } as any;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        AuthService,
        { provide: HashEncryptService, useValue: {} },
        {
          provide: UserRepoService,
          useValue: {},
        },
        {
          provide: IntendManagerService,
          useValue: intendManager,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should set the session property with auth information and redirect to correct url', async () => {
    const request: any = {
      session: {
        save: (value) => value,
      },
      user: { id: 1 },
    };

    const response: any = { redirect: (value) => value };

    const saveSpy = jest
      .spyOn(request.session, 'save')
      .mockImplementation((callback: () => void) => {
        callback();
      });

    const redirectSpy = jest.spyOn(response, 'redirect');
    const getSpy = jest
      .spyOn(intendManager, 'getUrl')
      .mockReturnValueOnce(null);

    await controller.login(request, response);
    expect(request).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          auth: expect.objectContaining({
            isAuth: true,
            userId: request.user.id,
          }),
        }),
      }),
    );
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(redirectSpy).toHaveBeenCalledWith('/dashboard');
    expect(getSpy).toHaveBeenCalledWith(request);
  });

  it('should set the session property with auth information and redirect to intend url', async () => {
    const request: any = {
      session: {
        save: (value) => value,
      },
      user: { id: 1 },
    };

    const response: any = { redirect: (value) => value };

    const saveSpy = jest
      .spyOn(request.session, 'save')
      .mockImplementation((callback: () => void) => {
        callback();
      });

    const redirectSpy = jest.spyOn(response, 'redirect');
    const getSpy = jest
      .spyOn(intendManager, 'getUrl')
      .mockReturnValueOnce('/intendUrl');

    const setSpy = jest.spyOn(intendManager, 'setUrl').mockImplementation();

    await controller.login(request, response);
    expect(request).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          auth: expect.objectContaining({
            isAuth: true,
            userId: request.user.id,
          }),
        }),
      }),
    );
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(redirectSpy).toHaveBeenCalledWith('/intendUrl');
    expect(getSpy).toHaveBeenCalledWith(request);
    expect(setSpy).toHaveBeenCalledWith(request, null);
  });

  it('should set the session property with auth information and redirect to correct url', async () => {
    const request: any = {
      session: {
        save: (value) => value,
      },
      user: { id: 1 },
    };

    const response: any = { redirect: (value) => value };

    const saveSpy = jest
      .spyOn(request.session, 'save')
      .mockImplementation((callback: () => void) => {
        callback();
      });

    const redirectSpy = jest.spyOn(response, 'redirect');
    const getSpy = jest
      .spyOn(intendManager, 'getUrl')
      .mockReturnValueOnce(null);

    await controller.login(request, response);
    expect(request).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          auth: expect.objectContaining({
            isAuth: true,
            userId: request.user.id,
          }),
        }),
      }),
    );
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(redirectSpy).toHaveBeenCalledWith('/dashboard');
    expect(getSpy).toHaveBeenCalledWith(request);
  });

  it('should fail with rejection session save failed', async () => {
    const request: any = {
      session: {
        save: (value) => value,
      },
      user: { id: 1 },
    };

    const response: any = { redirect: (value) => value };

    let calledForSuccess = false;
    const successSpy = jest
      .spyOn(request.session, 'save')
      .mockImplementation((callback: (err?: string) => void) => {
        if (!calledForSuccess) {
          callback();
          calledForSuccess = true;
          return;
        }
        callback('shouldFail');
      });

    const redirectSpy = jest.spyOn(response, 'redirect');
    jest.spyOn(intendManager, 'getUrl').mockReturnValueOnce('/intendUrl');

    jest.spyOn(intendManager, 'setUrl').mockImplementation();
    let errorThrown = false;
    try {
      await controller.login(request, response);
    } catch (err) {
      if (err === 'shouldFail') {
        errorThrown = true;
      }
    }

    expect(errorThrown).toEqual(true);
    expect(redirectSpy).not.toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalled();
  });

  it('should logout user from session', async () => {
    const request = {
      session: {
        regenerate: (value) => value,
      },
    };

    const regenerateSpy = jest
      .spyOn(request.session, 'regenerate')
      .mockImplementation((callback: () => void) => callback());

    expect(await controller.logout(request as any)).toEqual(true);
    expect(regenerateSpy).toHaveBeenCalled();
  });

  it('should throw error when regenerate fails', async () => {
    const request = {
      session: {
        regenerate: (value) => value,
      },
    };

    const regenerateSpy = jest
      .spyOn(request.session, 'regenerate')
      .mockImplementation((callback: (err: string) => void) =>
        callback('should fail'),
      );

    let errorThrown = false;
    try {
      await controller.logout(request as any);
    } catch (err) {
      if (err === 'should fail') {
        errorThrown = true;
      }
    }

    expect(errorThrown).toEqual(true);
    expect(regenerateSpy).toHaveBeenCalled();
  });
});
