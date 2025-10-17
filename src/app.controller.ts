import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: this.appService.getHello(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'PostgreSQL gr_db2',
    };
  }
}
