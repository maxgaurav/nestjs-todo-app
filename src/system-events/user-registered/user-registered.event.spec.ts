import { UserRegisteredEvent } from './user-registered.event';
import { UserModel } from '../../databases/models/user.model';

describe('UserRegisteredEvent', () => {
  let event: UserRegisteredEvent;
  const userModel: UserModel = {} as any;

  beforeEach(() => {
    event = new UserRegisteredEvent(userModel);
  });
  it('should be defined', () => {
    expect(event).toBeDefined();
  });
});
