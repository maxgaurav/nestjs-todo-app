import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { basicE2eSetup, createTransaction } from './basic-e2e-setup';
import { Transaction } from 'sequelize';
import { UserModel } from '../src/databases/models/user.model';
import { userFactory } from './factories/user.factory';
import { Request } from 'express';
import { taskFactory } from './factories/task.factory';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let transaction: Transaction;
  let user: UserModel;

  beforeEach(async () => {
    [app] = await basicE2eSetup({
      appInitHook: async (app) => {
        transaction = await createTransaction(app);
        user = await userFactory(app, transaction);
        await app.use((req: Request, res, next) => {
          (req.session as any).auth = {
            isAuth: true,
            userId: user.id,
          };

          next();
        });
      },
    });
  });

  afterEach(async () => {
    await transaction.rollback();
    await app.close();
  });

  it('/dashboard Without tasks (GET)', () => {
    return request(app.getHttpServer()).get('/dashboard').expect(200);
  });

  it('/dashboard With tasks (GET)', async () => {
    const task = await taskFactory(app, transaction, { user_id: user.id });
    return request(app.getHttpServer())
      .get('/dashboard')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain(task.name);
      });
  });
});
