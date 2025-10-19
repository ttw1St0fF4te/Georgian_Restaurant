import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
@Public() // Весь контроллер доступен всем
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Проверка работоспособности API',
    description: 'Возвращает статус работоспособности Georgian Restaurant API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API работает нормально',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', format: 'date-time' },
        service: { type: 'string', example: 'Georgian Restaurant API' }
      }
    }
  })
  async getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Georgian Restaurant API',
    };
  }

  @Get('db')
  @ApiOperation({ 
    summary: 'Проверка подключения к базе данных',
    description: 'Проверяет состояние подключения к PostgreSQL базе данных'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'База данных доступна',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        database: { type: 'string', example: 'gr_db2' },
        connected: { type: 'boolean', example: true }
      }
    }
  })
  async getDatabaseHealth() {
    return this.healthService.checkDatabaseConnection();
  }

  @Get('db/info')
  @ApiOperation({ 
    summary: 'Получить подробную информацию о базе данных',
    description: 'Возвращает версию PostgreSQL, имя БД и пользователя'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о базе данных получена',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'string', example: 'PostgreSQL 14.9' },
        database: { type: 'string', example: 'gr_db2' },
        user: { type: 'string', example: 'restaurant_admin' },
        connection_status: { type: 'string', example: 'active' }
      }
    }
  })
  async getDatabaseInfo() {
    return this.healthService.getDatabaseInfo();
  }
}