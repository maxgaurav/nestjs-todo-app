import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { ModelBootstrapModule } from '../databases/model-bootstrap/model-bootstrap.module';
import { TaskRepoService } from '../task/services/task-repo/task-repo.service';

@Module({
  imports: [ModelBootstrapModule.register()],
  controllers: [DashboardController],
  providers: [TaskRepoService],
})
export class DashboardModule {}
