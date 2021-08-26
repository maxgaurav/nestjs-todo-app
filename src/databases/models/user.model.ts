import { Column, HasMany, Table, Unique } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { TaskModel } from './task.model';

@Table({ tableName: 'users' })
export class UserModel extends BaseModel<UserModel> {
  @Unique
  @Column
  public email: string;

  @Column
  public password: string | null;

  @Column
  public is_verified: boolean;

  @HasMany(() => TaskModel)
  public tasks: TaskModel[] | undefined;
}
