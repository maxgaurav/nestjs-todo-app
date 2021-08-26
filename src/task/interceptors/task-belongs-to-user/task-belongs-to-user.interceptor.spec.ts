import { TaskBelongsToUserInterceptor } from './task-belongs-to-user.interceptor';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { UserModel } from '../../../databases/models/user.model';
import { TaskModel } from '../../../databases/models/task.model';
import { firstValueFrom, of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('TaskBelongsToUserInterceptor', () => {
  let interceptor: TaskBelongsToUserInterceptor;

  const taskRepo: TaskRepoService = { findOrFail: (value) => value } as any;

  beforeEach(() => {
    interceptor = new TaskBelongsToUserInterceptor(taskRepo);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should allow to pass when task belongs to user', async () => {
    const user: UserModel = { id: 1 } as any;
    const task: TaskModel = { id: 1, user_id: user.id } as any;
    const request = { user, params: { taskId: task.id } };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    const next = { handle: () => of(true) };

    const findSpy = jest
      .spyOn(taskRepo, 'findOrFail')
      .mockReturnValue(Promise.resolve(task));

    expect(
      await firstValueFrom(interceptor.intercept(context as any, next)),
    ).toEqual(true);
    expect(findSpy).toHaveBeenCalledWith(task.id);
  });

  it('should throw not found exception when task does not belongs to user', async () => {
    const user: UserModel = { id: 1 } as any;
    const task: TaskModel = { id: 1, user_id: 2 } as any;
    const request = { user, params: { taskId: task.id } };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    const next = { handle: () => of(true) };

    const findSpy = jest
      .spyOn(taskRepo, 'findOrFail')
      .mockReturnValue(Promise.resolve(task));

    let errorThrown = false;

    try {
      await firstValueFrom(interceptor.intercept(context as any, next));
    } catch (err) {
      if (err instanceof NotFoundException) {
        errorThrown = true;
      }
    }

    expect(errorThrown).toEqual(true);
    expect(findSpy).toHaveBeenCalledWith(task.id);
  });
});
