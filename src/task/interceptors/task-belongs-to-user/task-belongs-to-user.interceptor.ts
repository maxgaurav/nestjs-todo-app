import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { Request } from 'express';
import { UserModel } from '../../../databases/models/user.model';

@Injectable()
export class TaskBelongsToUserInterceptor implements NestInterceptor {
  constructor(private readonly taskRepo: TaskRepoService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const authUser = request.user as UserModel;
    const taskId = parseFloat(request.params.taskId);

    return from(this.taskRepo.findOrFail(taskId)).pipe(
      switchMap((task) => {
        if (task.user_id !== authUser.id) {
          return throwError(() => new NotFoundException());
        }
        return next.handle();
      }),
    );
  }
}
