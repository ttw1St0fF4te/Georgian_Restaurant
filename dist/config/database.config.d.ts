import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
export declare class DatabaseConfig implements TypeOrmOptionsFactory {
    private readonly configService;
    constructor(configService: ConfigService);
    createTypeOrmOptions(): TypeOrmModuleOptions;
}
