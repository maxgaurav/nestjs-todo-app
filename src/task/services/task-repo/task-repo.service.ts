import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TaskModel } from '../../../databases/models/task.model';
import { Transaction } from 'sequelize';
import { UserModel } from '../../../databases/models/user.model';

@Injectable()
export class TaskRepoService {
  constructor(@InjectModel(TaskModel) public taskModel: typeof TaskModel) {}

  /**
   * Returns list of task created by user
   * @param user
   * @param transaction
   */
  public listTaskForUser(
    user: UserModel,
    transaction?: Transaction,
  ): Promise<TaskModel[]> {
    return this.taskModel.findAll({ where: { user_id: user.id }, transaction });
  }

  /**
   * Find task by id or fail
   * @param taskId
   * @param transaction
   */
  public findOrFail(
    taskId: number,
    transaction?: Transaction,
  ): Promise<TaskModel> {
    return this.taskModel.findByPk(taskId, {
      transaction,
      rejectOnEmpty: true,
    });
  }

  /**
   * Creates new task in system
   * @param data
   * @param user
   * @param transaction
   */
  public createTask(
    data: Pick<TaskModel, 'name' | 'description' | 'due_on'>,
    user: UserModel,
    transaction?: Transaction,
  ): Promise<TaskModel> {
    return this.taskModel
      .build()
      .setAttributes(data)
      .setAttributes({ user_id: user.id })
      .save({ transaction })
      .then((task) => task.reload({ transaction }));
  }

  /**
   * Update task with values
   * @param data
   * @param task
   * @param transaction
   */
  public updateTask(
    task: TaskModel,
    data: Partial<
      Pick<TaskModel, 'name' | 'description' | 'due_on' | 'completed_on'>
    >,
    transaction?: Transaction,
  ): Promise<TaskModel> {
    return task.setAttributes(data).save({ transaction });
  }
}
