import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: false, // Отключено для production, используем миграции
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl: this.configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      extra: {
        timezone: 'Europe/Moscow',
      },
    };
  }
}