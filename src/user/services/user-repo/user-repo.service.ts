import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../databases/models/user.model';
import { EmptyResultError, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventRegisterCallbackService } from '../../../common/services/event-register-callback/event-register-callback.service';
import { SystemEvents } from '../../../system-events/system-events';
import { UserRegisteredEvent } from '../../../system-events/user-registered/user-registered.event';

@Injectable()
export class UserRepoService {
  constructor(
    @InjectModel(UserModel) public userModel: typeof UserModel,
    private hashService: HashEncryptService,
    private eventEmitter: EventEmitter2,
    private eventCallback: EventRegisterCallbackService,
  ) {}

  /**
   * Find by email or returns null when not not found
   * @param email
   * @param transaction
   */
  public findByEmail(
    email: string,
    transaction?: Transaction,
  ): Promise<UserModel | null> {
    return this.userModel
      .findOne({ where: { email }, transaction })
      .then((result) => (!!result ? result : null));
  }

  /**
   * Find user by email or fail
   * @param email
   * @param transaction
   */
  public findByEmailOrFail(
    email: string,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return this.findByEmail(email, transaction).then((result) => {
      if (!result) {
        throw new EmptyResultError();
      }
      return result;
    });
  }

  /**
   * Finds the user or fails
   * @param id
   * @param transaction
   */
  public findOrFail(id: number, transaction?: Transaction): Promise<UserModel> {
    return this.userModel.findByPk(id, { transaction, rejectOnEmpty: true });
  }

  /**
   * Create a new user
   * @param userData
   * @param transaction
   */
  public async createUser(
    userData: Pick<UserModel, 'email' | 'password'>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    let newUser: UserModel;
    const callback = this.eventCallback.registerEventCallBacks(
      async () =>
        await this.eventEmitter.emitAsync(
          SystemEvents.UserRegistered,
          new UserRegisteredEvent(newUser),
        ),
      transaction,
    );
    return this.userModel
      .build()
      .setAttributes(userData)
      .setAttributes({
        password: await this.hashService.createHash(userData.password),
      })
      .save({ transaction })
      .then((userModel) => userModel.reload({ transaction }))
      .then(async (userModel) => {
        await callback();
        newUser = userModel;
        return userModel;
      });
  }

  /**
   * Marks user as verified
   * @param userId
   * @param transaction
   */
  public async markUserVerified(
    userId: number | UserModel,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const user: UserModel =
      typeof userId === 'number'
        ? await this.findOrFail(userId, transaction)
        : userId;

    return user.setAttributes({ is_verified: true }).save({ transaction });
  }
}
