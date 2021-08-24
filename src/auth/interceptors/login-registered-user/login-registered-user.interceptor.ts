import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../../../databases/models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class LoginRegisteredUserInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((user: UserModel) => {
        this.authService.mapSessionWithUser(request.session, user);
        return user;
      }),
    );
  }
}
