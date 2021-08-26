import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { WebGuard } from '../../../auth/guards/web/web.guard';
import { TaskRepoService } from '../../../task/services/task-repo/task-repo.service';
import { TaskModel } from '../../../databases/models/task.model';
import { AuthUser } from '../../../auth/decorators/auth-user.decorator';
import { UserModel } from '../../../databases/models/user.model';
import { ReqTransaction } from '../../../transaction-manager/decorators/transaction/transaction.decorator';
import { Transaction } from 'sequelize';

@UseGuards(WebGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private taskRepo: TaskRepoService) {}

  @Get()
  @Render('auth/dashboard')
  public async dashboard(
    @AuthUser() user: UserModel,
    @ReqTransaction() transaction?: Transaction,
  ): Promise<{ tasks: TaskModel[] }> {
    return {
      tasks: await this.taskRepo.listTaskForUser(user, transaction),
    };
  }
}
