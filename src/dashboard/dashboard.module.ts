import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard/dashboard.controller';

@Module({
  controllers: [DashboardController]
})
export class DashboardModule {}
