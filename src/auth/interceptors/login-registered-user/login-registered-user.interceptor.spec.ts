import { LoginRegisteredUserInterceptor } from './login-registered-user.interceptor';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom, of } from 'rxjs';
import { UserModel } from '../../../databases/models/user.model';

describe('LoginRegisteredUserInterceptor', () => {
  let interceptor: LoginRegisteredUserInterceptor;

  const authService: AuthService = {
    mapSessionWithUser: (value) => value,
  } as any;

  beforeEach(() => {
    interceptor = new LoginRegisteredUserInterceptor(authService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should map registered user to session', async () => {
    const request = { session: {} };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    };

    const user: UserModel = {} as any;

    const next = { handle: () => of(user) };
    const mapAuthSpy = jest.spyOn(authService, 'mapSessionWithUser');

    expect(
      await firstValueFrom(interceptor.intercept(context as any, next)),
    ).toEqual(user);

    expect(mapAuthSpy).toHaveBeenCalledWith(request.session, user);
  });
});
