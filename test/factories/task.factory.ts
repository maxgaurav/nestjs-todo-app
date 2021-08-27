import { INestApplication } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { TaskModel } from '../../src/databases/models/task.model';

export const taskFactory = (
  app: INestApplication,
  transaction: Transaction,
  overwrite: Partial<TaskModel> = {},
): Promise<TaskModel> => {
  return app
    .get<typeof TaskModel>(getModelToken(TaskModel))
    .build()
    .setAttributes({ name: 'TASKS NAME', description: 'description' })
    .setAttributes(overwrite)
    .save({ transaction });
};
