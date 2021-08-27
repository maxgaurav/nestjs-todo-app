import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { basicE2eSetup, createTransaction } from './basic-e2e-setup';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { UserModel } from '../src/databases/models/user.model';
import { userFactory } from './factories/user.factory';

describe('AppController Authenticated (e2e)', () => {
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

  it('/ On Logged In User (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .redirects(1)
      .expect((res) => {
        expect(res.redirects.length).toEqual(1);
        expect(res.redirects[0]).toContain('/dashboard');
      });
  });
});
