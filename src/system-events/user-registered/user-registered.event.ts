import { UserModel } from '../../databases/models/user.model';

export class UserRegisteredEvent {
  constructor(public userModel: UserModel) {}
}
