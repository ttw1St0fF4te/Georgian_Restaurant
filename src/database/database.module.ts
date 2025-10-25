import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from '../config/database.config';
import { DatabaseDumpService } from './database-dump.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ConfigModule,
  ],
  controllers: [DatabaseController],
  providers: [DatabaseDumpService],
  exports: [TypeOrmModule, DatabaseDumpService],
})
export class DatabaseModule {}