import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { MenuCategoriesModule } from './menu-categories/menu-categories.module';
import { MenuModule } from './menu/menu.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalJwtAuthGuard } from './auth/guards/global-jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    AuditModule,
    AuthModule,
    MenuCategoriesModule,
    MenuModule,
    RestaurantsModule,
    CartModule,
    ReviewsModule,
    ReservationsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
