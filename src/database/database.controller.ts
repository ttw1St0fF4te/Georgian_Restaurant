import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { DatabaseDumpService } from './database-dump.service';

@ApiTags('database')
@Controller('database')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DatabaseController {
  constructor(private readonly databaseDumpService: DatabaseDumpService) {}

  @Post('dump')
  @Roles('admin') // Только администратор может создавать дампы БД
  @ApiOperation({ 
    summary: 'Создать полный дамп базы данных',
    description: 'Создает полный дамп базы данных с помощью pg_dump и сохраняет его на рабочий стол сервера'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Дамп базы данных создан успешно',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Database dump created successfully' },
        filePath: { type: 'string', example: '/Users/username/Desktop/db_dump_2025-10-25T12-00-00-000Z.sql' },
        fileName: { type: 'string', example: 'db_dump_2025-10-25T12-00-00-000Z.sql' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Ошибка создания дампа' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  async createDatabaseDump() {
    try {
      const result = await this.databaseDumpService.createDatabaseDump();
      
      return {
        success: true,
        message: 'Database dump created successfully',
        filePath: result.filePath,
        fileName: result.fileName
      };
    } catch (error) {
      throw new Error(`Failed to create database dump: ${error.message}`);
    }
  }

  @Get('info')
  @Roles('admin', 'manager') // Администратор и менеджер могут просматривать информацию о БД
  @ApiOperation({ 
    summary: 'Получить информацию о базе данных',
    description: 'Возвращает основную информацию о подключении к базе данных'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о базе данных получена',
    schema: {
      type: 'object',
      properties: {
        host: { type: 'string', example: 'localhost' },
        port: { type: 'string', example: '5432' },
        database: { type: 'string', example: 'restaurant_db' },
        user: { type: 'string', example: 'postgres' }
      }
    }
  })
  async getDatabaseInfo() {
    return this.databaseDumpService.getDatabaseInfo();
  }
}