import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseRoleService } from './database-role.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { UserAddress } from '../entities/user-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, UserAddress]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'georgian-restaurant-secret-key',
        signOptions: { 
          expiresIn: '24h' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, DatabaseRoleService, TokenBlacklistService],
  exports: [AuthService, DatabaseRoleService, TokenBlacklistService],
})
export class AuthModule {}