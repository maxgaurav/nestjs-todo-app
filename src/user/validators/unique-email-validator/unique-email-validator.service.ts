import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepoService } from '../../services/user-repo/user-repo.service';

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmailValidatorService
  implements ValidatorConstraintInterface
{
  constructor(private userRepo: UserRepoService) {}

  /**
   * The default message to show for validation
   */
  defaultMessage(): string {
    return 'The email already in use';
  }

  /**
   * Validation logic
   * @param email
   */
  async validate(email: string | null | undefined): Promise<boolean> {
    if (!email) {
      return true;
    }

    return this.userRepo.findByEmail(email).then((result) => !result);
  }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidatorService,
    });
  };
}
