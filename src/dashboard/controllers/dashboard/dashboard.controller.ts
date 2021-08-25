import { Controller, Get, Render, UseFilters, UseGuards } from '@nestjs/common';
import { WebGuard } from '../../../auth/guards/web/web.guard';
import { RedirectToLoginFilter } from '../../../session-manager/filters/redirect-to-login/redirect-to-login.filter';

@UseFilters(RedirectToLoginFilter)
@Controller('dashboard')
export class DashboardController {
  @UseGuards(WebGuard)
  @Get()
  @Render('auth/dashboard')
  public dashboard() {
    return {};
  }
}
