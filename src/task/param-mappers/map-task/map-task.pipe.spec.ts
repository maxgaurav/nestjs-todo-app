import { MapTaskPipe } from './map-task.pipe';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';

describe('MapTaskPipe', () => {
  let pipe: MapTaskPipe;

  const taskRepo: TaskRepoService = { findOrFail: (value) => value } as any;

  beforeEach(() => {
    pipe = new MapTaskPipe(taskRepo);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the task model mapped to param', async () => {
    const task: TaskModel = { id: 1 } as TaskModel;
    const findSpy = jest
      .spyOn(taskRepo, 'findOrFail')
      .mockReturnValue(Promise.resolve(task));

    expect(await pipe.transform(task.id)).toEqual(task);
    expect(findSpy).toHaveBeenCalledWith(task.id);
  });
});
