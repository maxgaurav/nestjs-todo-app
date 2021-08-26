import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';

@Table({ tableName: 'tasks' })
export class TaskModel extends BaseModel<TaskModel> {
  @ForeignKey(() => UserModel)
  @Column
  public user_id: number;

  @Column
  public name: string;

  @Column
  public description: string | null;

  @Column
  public completed_on: Date | null;

  @Column
  public due_on: Date | null;

  @BelongsTo(() => UserModel)
  public user: UserModel | undefined;
}
