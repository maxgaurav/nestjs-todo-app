import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { TaskRepoService } from '../../../task/services/task-repo/task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';
import { UserModel } from '../../../databases/models/user.model';

describe('DashboardController', () => {
  let controller: DashboardController;
  const taskRepo: TaskRepoService = {
    listTaskForUser: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: TaskRepoService,
          useValue: taskRepo,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of tasks to render', async () => {
    const user: UserModel = { id: 1 } as any;

    const task: TaskModel = { id: 1, user_id: user.id } as any;
    const listSpy = jest
      .spyOn(taskRepo, 'listTaskForUser')
      .mockReturnValue(Promise.resolve([task]));
    const transaction = null;

    expect(await controller.dashboard(user, transaction)).toEqual(
      expect.objectContaining({
        tasks: [task],
      }),
    );
    expect(listSpy).toHaveBeenCalledWith(user, transaction);
  });
});
