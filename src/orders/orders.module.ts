import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { User } from '../entities/user.entity';
import { UserAddress } from '../entities/user-address.entity';
import { TableReservation } from '../entities/table-reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Cart,
      CartItem,
      User,
      UserAddress,
      TableReservation,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}