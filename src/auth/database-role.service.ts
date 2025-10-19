import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseRoleService {
  private connections: Map<string, DataSource> = new Map();

  constructor(private configService: ConfigService) {}

  async getConnectionForRole(role: string): Promise<DataSource> {
    const dbRole = this.mapApplicationRoleToDbRole(role);
    
    if (this.connections.has(dbRole)) {
      return this.connections.get(dbRole);
    }

    const connection = await this.createConnectionForRole(dbRole);
    this.connections.set(dbRole, connection);
    return connection;
  }

  private mapApplicationRoleToDbRole(role: string): string {
    const roleMapping = {
      admin: 'restaurant_admin',
      manager: 'restaurant_manager', 
      user: 'restaurant_user',
      guest: 'restaurant_guest',
    };

    return roleMapping[role] || 'restaurant_guest';
  }

  private async createConnectionForRole(dbRole: string): Promise<DataSource> {
    const dataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: dbRole,
      password: this.configService.get<string>('DB_PASSWORD', 'new_secure_password!'),
      database: this.configService.get<string>('DB_NAME', 'gr_db2'),
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      synchronize: false, // В продакшене должно быть false
    });

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    return dataSource;
  }

  async closeAllConnections(): Promise<void> {
    for (const [role, connection] of this.connections.entries()) {
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }
    this.connections.clear();
  }
}