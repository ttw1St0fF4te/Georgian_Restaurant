import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Georgian Restaurant API',
    };
  }

  @Get('db')
  async getDatabaseHealth() {
    return this.healthService.checkDatabaseConnection();
  }

  @Get('db/info')
  async getDatabaseInfo() {
    return this.healthService.getDatabaseInfo();
  }
}