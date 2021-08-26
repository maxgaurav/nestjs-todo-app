import { Module } from '@nestjs/common';
import { TaskRepoService } from './services/task-repo/task-repo.service';
import { ModelBootstrapModule } from '../databases/model-bootstrap/model-bootstrap.module';
import { TaskController } from './controllers/task/task.controller';
import { MapTaskPipe } from './param-mappers/map-task/map-task.pipe';

@Module({
  imports: [ModelBootstrapModule.register()],
  providers: [TaskRepoService, MapTaskPipe],
  controllers: [TaskController],
})
export class TaskModule {}
