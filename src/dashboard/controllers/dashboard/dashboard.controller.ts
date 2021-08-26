import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { WebGuard } from '../../../auth/guards/web/web.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(WebGuard)
  @Get()
  @Render('auth/dashboard')
  public dashboard() {
    return {};
  }
}
