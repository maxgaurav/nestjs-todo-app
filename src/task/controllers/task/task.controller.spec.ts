import { Test, TestingModule } from '@nestjs/testing';
import { editTaskRedirect, TaskController } from './task.controller';
import { TransactionProviderService } from '../../../transaction-manager/services/transaction-provider/transaction-provider.service';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { TaskModel } from '../../../databases/models/task.model';
import { UserModel } from '../../../databases/models/user.model';
import { StoreTaskDto } from '../../dtos/store-task/store-task.dto';
import * as mockdate from 'mockdate';

describe('TaskController', () => {
  let controller: TaskController;

  const taskRepo: TaskRepoService = {
    createTask: (value) => value,
    updateTask: (value) => value,
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

  it('should return content to render edit view of task', async () => {
    const task: TaskModel = { id: 1 } as any;
    const generateUrlSpy = jest
      .spyOn(urlGenerator, 'generateUrlFromController')
      .mockReturnValue('updateUrl');

    expect(await controller.edit(task)).toEqual(
      expect.objectContaining({
        task,
        updateTaskUrl: 'updateUrl',
      }),
    );

    expect(generateUrlSpy).toHaveBeenCalledWith({
      controller: TaskController,
      controllerMethod: TaskController.prototype.update,
      params: { taskId: task.id },
    });
  });

  it('should update the task content with data', async () => {
    const task: TaskModel = { id: 1 } as any;
    const data: StoreTaskDto = new StoreTaskDto();
    data.name = 'name';
    data.due_on = new Date();
    data.description = 'Description';

    const transaction = null;

    const updateSpy = jest
      .spyOn(taskRepo, 'updateTask')
      .mockReturnValue(Promise.resolve(task));

    expect(await controller.update(task, data, transaction)).toEqual(task);
    expect(updateSpy).toHaveBeenCalledWith(task, data, transaction);
  });

  it('should mark task as complete', async () => {
    const task: TaskModel = { id: 1 } as any;
    const updateTaskSpy = jest
      .spyOn(taskRepo, 'updateTask')
      .mockReturnValue(Promise.resolve(task));
    const transaction = null;
    const date = new Date();
    mockdate.set(date);
    expect(await controller.markComplete(task, transaction)).toEqual(task);
    expect(updateTaskSpy).toHaveBeenCalledWith(
      task,
      { completed_on: date },
      transaction,
    );
  });

  it('should mark task as in complete', async () => {
    const task: TaskModel = { id: 1 } as any;
    const updateTaskSpy = jest
      .spyOn(taskRepo, 'updateTask')
      .mockReturnValue(Promise.resolve(task));
    const transaction = null;
    expect(await controller.markInComplete(task, transaction)).toEqual(task);
    expect(updateTaskSpy).toHaveBeenCalledWith(
      task,
      { completed_on: null },
      transaction,
    );
  });

  it('should return correct redirect url', () => {
    const task: TaskModel = { id: 1 } as any;
    expect(editTaskRedirect(task, {} as any)).toEqual(`/tasks/${task.id}/edit`);
  });
});
