import { Injectable, PipeTransform } from '@nestjs/common';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';

@Injectable()
export class MapTaskPipe implements PipeTransform {
  constructor(private readonly taskRepo: TaskRepoService) {}

  transform(taskId: any): Promise<TaskModel> {
    return this.taskRepo.findOrFail(taskId);
  }
}
