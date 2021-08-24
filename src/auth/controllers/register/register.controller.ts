import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { RegisterUserDto } from '../../dtos/register-user/register-user.dto';
import { OldInputsInterceptor } from '../../../session-manager/interceptors/old-inputs/old-inputs.interceptor';
import { SessionErrorValidationInterceptor } from '../../../session-manager/interceptors/session-error-validation/session-error-validation.interceptor';
import { TransactionInterceptor } from '../../../helpers/interceptors/transaction/transaction.interceptor';
import { ReqTransaction } from '../../../transaction-manager/decorators/transaction/transaction.decorator';
import { Transaction } from 'sequelize';
import { UserRepoService } from '../../../user/services/user-repo/user-repo.service';
import { UserModel } from '../../../databases/models/user.model';

@UseInterceptors(OldInputsInterceptor, SessionErrorValidationInterceptor)
@Controller('register')
export class RegisterController {
  constructor(
    private urlGenerate: UrlGeneratorService,
    private userRepo: UserRepoService,
  ) {}

  @Get()
  @Render('register-user')
  public showForm() {
    return {
      registerUrl: this.urlGenerate.generateUrlFromController({
        controller: RegisterController,
        controllerMethod: RegisterController.prototype.register,
      }),
    };
  }

  /**
   * Register a new user
   * @param registerData
   * @param transaction
   */
  @Redirect('/register')
  @UseInterceptors(TransactionInterceptor)
  @Post()
  public async register(
    @Body() registerData: RegisterUserDto,
    @ReqTransaction() transaction?: Transaction,
  ): Promise<UserModel> {
    return this.userRepo.createUser(
      registerData.registrationInfo(),
      transaction,
    );
  }
}
