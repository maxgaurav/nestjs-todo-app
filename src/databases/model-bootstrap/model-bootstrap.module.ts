import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../models/user.model';
import { TaskModel } from '../models/task.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, TaskModel])],
})
export class ModelBootstrapModule {
  static register() {
    return SequelizeModule.forFeature([UserModel, TaskModel]);
  }
}
