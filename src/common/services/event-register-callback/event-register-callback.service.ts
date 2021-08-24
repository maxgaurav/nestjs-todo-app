import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CallbackExecutioner } from '../../../interfaces/transaction-callback.interface';

@Injectable()
export class EventRegisterCallbackService {
  /**
   * Register callbacks for transaction. If transaction does not exists then fires synchronously
   * @param callback
   * @param transaction
   */
  public registerEventCallBacks(
    callback: () => Promise<void | any>,
    transaction?: Transaction | undefined,
  ): CallbackExecutioner {
    if (!!transaction) {
      transaction.afterCommit(async () => {
        try {
          await callback();
        } catch (err) {
          console.warn('Unable to process callback');
          console.error(err);
        }
      });
      return () => Promise.resolve();
    }

    return () => callback();
  }
}
