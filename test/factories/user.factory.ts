import { INestApplication } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { UserModel } from '../../src/databases/models/user.model';
import { getModelToken } from '@nestjs/sequelize';

export const userFactory = (
  app: INestApplication,
  transaction: Transaction,
  overwrite: Partial<UserModel> = {},
): Promise<UserModel> => {
  return app
    .get<typeof UserModel>(getModelToken(UserModel))
    .build()
    .setAttributes({ email: 'email@email.com' })
    .setAttributes(overwrite)
    .save({ transaction });
};
