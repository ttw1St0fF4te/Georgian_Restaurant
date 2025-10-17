import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async checkDatabaseConnection(): Promise<{ status: string; database: string; connected: boolean }> {
    try {
      const isConnected = this.dataSource.isInitialized;
      const databaseName = this.dataSource.options.database as string;
      
      if (isConnected) {
        // Простой запрос для проверки подключения
        await this.dataSource.query('SELECT 1');
        return {
          status: 'OK',
          database: databaseName,
          connected: true,
        };
      }
      
      return {
        status: 'ERROR',
        database: databaseName,
        connected: false,
      };
    } catch (error) {
      return {
        status: 'ERROR',
        database: 'unknown',
        connected: false,
      };
    }
  }

  async getDatabaseInfo(): Promise<any> {
    try {
      const version = await this.dataSource.query('SELECT version()');
      const currentDatabase = await this.dataSource.query('SELECT current_database()');
      const currentUser = await this.dataSource.query('SELECT current_user');
      
      return {
        version: version[0]?.version,
        database: currentDatabase[0]?.current_database,
        user: currentUser[0]?.current_user,
        connection_status: 'active',
      };
    } catch (error) {
      throw new Error(`Database info error: ${error.message}`);
    }
  }
}