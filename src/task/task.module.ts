import { Module } from '@nestjs/common';
import { TaskRepoService } from './services/task-repo/task-repo.service';
import { ModelBootstrapModule } from '../databases/model-bootstrap/model-bootstrap.module';
import { TaskController } from './controllers/task/task.controller';

@Module({
  imports: [ModelBootstrapModule.register()],
  providers: [TaskRepoService],
  controllers: [TaskController],
})
export class TaskModule {}
