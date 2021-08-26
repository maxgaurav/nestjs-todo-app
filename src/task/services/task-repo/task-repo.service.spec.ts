import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepoService } from './task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';
import { getModelToken } from '@nestjs/sequelize';

describe('TaskRepoService', () => {
  let service: TaskRepoService;

  const model: typeof TaskModel = {} as any;

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
});
