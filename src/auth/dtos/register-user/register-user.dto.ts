import { IsEmail, IsNotEmpty, IsNotIn, MinLength } from 'class-validator';
import { Match } from '../../../common/validators/match/match.validator';
import { UniqueEmail } from '../../../user/validators/unique-email-validator/unique-email-validator.service';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsNotIn(['password'])
  public password: string;

  @IsNotEmpty()
  @Match('password')
  public confirm_password: string;

  public registrationInfo(): { email: string; password: string } {
    return { email: this.email, password: this.password };
  }
}
