import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { TransactionProviderService } from '../../../transaction-manager/services/transaction-provider/transaction-provider.service';
import { UserModel } from '../../../databases/models/user.model';
import { RegisterUserDto } from '../../dtos/register-user/register-user.dto';

describe('RegisterController', () => {
  let controller: RegisterController;

  const userRepo: UserRepoService = { createUser: (value) => value } as any;
  const urlGenerator: UrlGeneratorService = {
    generateUrlFromController: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        { useValue: urlGenerator, provide: UrlGeneratorService },
        { provide: UserRepoService, useValue: userRepo },
        { provide: TransactionProviderService, useValue: {} },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should show registration form', () => {
    const urlGeneratorSpy = jest
      .spyOn(urlGenerator, 'generateUrlFromController')
      .mockReturnValue('url');

    expect(controller.showForm()).toEqual({ registerUrl: 'url' });
    expect(urlGeneratorSpy).toHaveBeenCalledWith({
      controller: RegisterController,
      controllerMethod: RegisterController.prototype.register,
    });
  });

  it('should register user and return', async () => {
    const user: UserModel = { id: 1 } as any;
    const createUserSpy = jest
      .spyOn(userRepo, 'createUser')
      .mockReturnValue(Promise.resolve(user));
    const transaction = null;
    const dto = new RegisterUserDto();
    dto.email = 'email@email.com';
    dto.password = 'password';

    expect(await controller.register(dto, transaction)).toEqual(user);
    expect(createUserSpy).toHaveBeenCalledWith(
      dto.registrationInfo(),
      transaction,
    );
  });
});
