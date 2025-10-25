import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseDumpService {
  constructor(private configService: ConfigService) {}

  /**
   * Создает полный дамп базы данных с помощью pg_dump
   * Сохраняет файл на рабочий стол сервера
   */
  async createDatabaseDump(): Promise<{ filePath: string; fileName: string }> {
    const dbHost = 'localhost'; // не используется в docker exec, но может быть для логов
    const dbPort = this.configService.get<string>('DB_PORT', '5432');
    const dbName = this.configService.get<string>('DB_DATABASE');
    const dbUser = this.configService.get<string>('DB_USERNAME');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    const containerName = 'pgdocker'; 

    if (!dbName || !dbUser) {
        throw new Error('Database configuration not found');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `db_dump_${timestamp}.sql`;
    const desktopDir = path.join(os.homedir(), 'Desktop');
    const filePath = path.join(desktopDir, fileName);

    if (!fs.existsSync(desktopDir)) {
        throw new Error(`Desktop directory not found: ${desktopDir}`);
    }
    // Альтернатива: использовать PGPASSWORD в команде
    const fullCommand = `PGPASSWORD=${dbPassword} docker exec -i ${containerName} pg_dump -U ${dbUser} --no-password --verbose --clean --create --if-exists --format=plain ${dbName} > "${filePath}"`;

    try {
        console.log(`Creating dump of database: ${dbName}`);
        console.log(`Using container: ${containerName}`);
        console.log(`Output file: ${filePath}`);

        // Выполняем команду с перенаправлением в файл через shell
        const { stdout, stderr } = await execAsync(fullCommand, {
        shell: '/bin/bash', // важно для перенаправления >
        env: { ...process.env, PGPASSWORD: dbPassword },
        });

        if (stderr && !stderr.includes('NOTICE')) {
        console.warn('Command stderr:', stderr);
        }

        if (!fs.existsSync(filePath)) {
        throw new Error('Dump file was not created');
        }

        const stats = fs.statSync(filePath);
        console.log(`Database dump created successfully: ${filePath} (${stats.size} bytes)`);

        return { filePath, fileName };
    } catch (error) {
        console.error('Error creating database dump:', error);

        if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkError) {
            console.error('Error removing partial dump file:', unlinkError);
        }
        }

        throw new Error(`Failed to create database dump: ${error.message}`);
    }
    }

  /**
   * Получает информацию о базе данных
   */
  async getDatabaseInfo(): Promise<{
    host: string;
    port: string;
    database: string;
    user: string;
  }> {
    return {
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<string>('DB_PORT', '5432'),
      database: this.configService.get<string>('DB_DATABASE', ''),
      user: this.configService.get<string>('DB_USERNAME', '')
    };
  }
}