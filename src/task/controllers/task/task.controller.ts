import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from '../../../auth/decorators/auth-user.decorator';
import { WebGuard } from '../../../auth/guards/web/web.guard';
import { UserModel } from '../../../databases/models/user.model';
import { TaskRepoService } from '../../services/task-repo/task-repo.service';
import { TransactionInterceptor } from '../../../transaction-manager/interceptors/transaction/transaction.interceptor';
import { ReqTransaction } from '../../../transaction-manager/decorators/transaction/transaction.decorator';
import { Transaction } from 'sequelize';
import { SessionErrorValidationInterceptor } from '../../../session-manager/interceptors/session-error-validation/session-error-validation.interceptor';
import { OldInputsInterceptor } from '../../../session-manager/interceptors/old-inputs/old-inputs.interceptor';
import { StoreTaskDto } from '../../dtos/store-task/store-task.dto';
import { UrlGeneratorService } from 'nestjs-url-generator';
import { TaskModel } from '../../../databases/models/task.model';

@UseInterceptors(SessionErrorValidationInterceptor, OldInputsInterceptor)
@UseGuards(WebGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskRepo: TaskRepoService,
    private readonly urlGenerator: UrlGeneratorService,
  ) {}

  /**
   * Render create view
   */
  @Get('create')
  @Render('auth/tasks/task-create')
  public create(): { [key: string]: any } {
    return {
      storeTaskUrl: this.urlGenerator.generateUrlFromController({
        controller: TaskController,
        controllerMethod: TaskController.prototype.store,
      }),
    };
  }

  /**
   * Store the task
   * @param storeTaskDto
   * @param user
   * @param transaction
   */
  @UseInterceptors(TransactionInterceptor)
  @Redirect('/dashboard')
  @Post()
  public store(
    @Body() storeTaskDto: StoreTaskDto,
    @AuthUser() user: UserModel,
    @ReqTransaction() transaction?: Transaction,
  ): Promise<TaskModel> {
    return this.taskRepo.createTask(storeTaskDto, user, transaction);
  }
}
