import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить информацию о приложении',
    description: 'Возвращает базовую информацию о Georgian Restaurant API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о приложении успешно получена',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello Georgian Restaurant API!' },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', example: '1.0.0' },
        database: { type: 'string', example: 'PostgreSQL gr_db2' }
      }
    }
  })
  getHello() {
    return {
      message: this.appService.getHello(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'PostgreSQL gr_db2',
    };
  }
}
