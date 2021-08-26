import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TransactionProviderService } from '../../../transaction-manager/services/transaction-provider/transaction-provider.service';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { TaskModel } from '../../../databases/models/task.model';
import { UserModel } from '../../../databases/models/user.model';
import { StoreTaskDto } from '../../dtos/store-task/store-task.dto';

describe('TaskController', () => {
  let controller: TaskController;

  const taskRepo: TaskRepoService = {
    createTask: (value) => value,
  } as any;
  const urlGenerator: UrlGeneratorService = {
    generateUrlFromController: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TransactionProviderService,
          useValue: {},
        },
        {
          provide: TaskRepoService,
          useValue: taskRepo,
        },
        {
          provide: UrlGeneratorService,
          useValue: urlGenerator,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return create view content for rendering', () => {
    const generateUrlSpy = jest
      .spyOn(urlGenerator, 'generateUrlFromController')
      .mockReturnValue('storeUrl');

    expect(controller.create()).toEqual(
      expect.objectContaining({
        storeTaskUrl: 'storeUrl',
      }),
    );
    expect(generateUrlSpy).toHaveBeenCalledWith({
      controller: TaskController,
      controllerMethod: TaskController.prototype.store,
    });
  });

  it('should create task and return the task instance', async () => {
    const user: UserModel = { id: 1 } as any;
    const task: TaskModel = { id: 1, user_id: user.id } as any;
    const createSpy = jest
      .spyOn(taskRepo, 'createTask')
      .mockReturnValue(Promise.resolve(task));

    const transaction = null;

    const storeTaskDto = new StoreTaskDto();
    storeTaskDto.name = 'name';
    storeTaskDto.due_on = new Date();
    storeTaskDto.description = 'description';

    expect(await controller.store(storeTaskDto, user, transaction)).toEqual(
      task,
    );
    expect(createSpy).toHaveBeenCalledWith(storeTaskDto, user, transaction);
  });
});
