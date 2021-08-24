import { Test, TestingModule } from '@nestjs/testing';
import { UniqueEmailValidatorService } from './unique-email-validator.service';
import { UserRepoService } from '../../services/user-repo/user-repo.service';

describe('UniqueEmailValidatorService', () => {
  let service: UniqueEmailValidatorService;

  const userRepo: UserRepoService = {
    findByEmail: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniqueEmailValidatorService,
        { provide: UserRepoService, useValue: userRepo },
      ],
    }).compile();

    service = module.get<UniqueEmailValidatorService>(
      UniqueEmailValidatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when value is undefined or null or empty string', async () => {
    expect(await service.validate(null)).toEqual(true);
    expect(await service.validate('')).toEqual(true);
    expect(await service.validate(undefined)).toEqual(true);
  });

  it('should return true when user is not found for email', async () => {
    const findSpy = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValue(Promise.resolve(null));
    expect(await service.validate('test@test.com')).toEqual(true);
    expect(findSpy).toHaveBeenCalledWith('test@test.com');
  });

  it('should return false when user is found for email', async () => {
    const findSpy = jest
      .spyOn(userRepo, 'findByEmail')
      .mockReturnValue(Promise.resolve({} as any));
    expect(await service.validate('test@test.com')).toEqual(false);
    expect(findSpy).toHaveBeenCalledWith('test@test.com');
  });

  it('should return default message', () => {
    expect(service.defaultMessage()).toBeTruthy();
  });
});
