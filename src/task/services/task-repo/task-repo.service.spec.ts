import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepoService } from './task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';
import { getModelToken } from '@nestjs/sequelize';
import { UserModel } from '../../../databases/models/user.model';

describe('TaskRepoService', () => {
  let service: TaskRepoService;

  const model: typeof TaskModel = {
    findByPk: (value) => value,
    build: (value) => value,
    findAll: (value) => value,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepoService,
        {
          provide: getModelToken(TaskModel),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<TaskRepoService>(TaskRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find task or fail by id', async () => {
    const task: TaskModel = { id: 1 } as any;
    const findSpy = jest
      .spyOn(model, 'findByPk')
      .mockReturnValueOnce(Promise.resolve(task));

    const transaction = null;
    expect(await service.findOrFail(task.id, transaction)).toEqual(task);

    expect(findSpy).toHaveBeenCalledWith(task.id, {
      transaction,
      rejectOnEmpty: true,
    });
  });

  it('should create task and return instance', async () => {
    const task: TaskModel = {
      id: 1,
      setAttributes: (value) => value,
      save: (value) => value,
      reload: (value) => value,
    } as any;

    const buildSpy = jest.spyOn(model, 'build').mockReturnValueOnce(task);
    const setAttributeSpy = jest
      .spyOn(task, 'setAttributes')
      .mockReturnValue(task);
    const saveSpy = jest
      .spyOn(task, 'save')
      .mockReturnValue(Promise.resolve(task));
    const reloadSpy = jest
      .spyOn(task, 'reload')
      .mockReturnValue(Promise.resolve(task));
    const data = {
      name: 'name',
      description: 'description',
      due_on: new Date(),
    };
    const user: UserModel = { id: 1 } as any;
    const transaction = null;

    expect(await service.createTask(data, user, transaction)).toEqual(task);
    expect(buildSpy).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(1, data);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(2, { user_id: user.id });
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
    expect(reloadSpy).toHaveBeenCalledWith({ transaction });
  });

  it('should return list of tasks mapped to user', async () => {
    const user: UserModel = { id: 1 } as any;
    const task: TaskModel = { id: 1, user_id: user.id } as any;
    const findAllSpy = jest
      .spyOn(model, 'findAll')
      .mockReturnValue(Promise.resolve([task]));

    const transaction = null;
    expect(await service.listTaskForUser(user, transaction)).toEqual([task]);
    expect(findAllSpy).toHaveBeenCalledWith({
      where: { user_id: user.id },
      transaction,
    });
  });

  it('should update the task with new data', async () => {
    const data: Partial<
      Pick<TaskModel, 'name' | 'description' | 'due_on' | 'completed_on'>
    > = {
      name: 'name',
      completed_on: new Date(),
      due_on: new Date(),
      description: 'description',
    };

    const task: TaskModel = {
      id: 1,
      save: (value) => value,
      setAttributes: (value) => value,
    } as any;

    const transaction = null;

    const setAttributesSpy = jest
      .spyOn(task, 'setAttributes')
      .mockReturnValue(task);
    const saveSpy = jest
      .spyOn(task, 'save')
      .mockReturnValue(Promise.resolve(task));

    expect(await service.updateTask(data, task, transaction)).toEqual(task);
    expect(setAttributesSpy).toHaveBeenCalledWith(data);
    expect(saveSpy).toHaveBeenCalledWith({ transaction });
  });
});
