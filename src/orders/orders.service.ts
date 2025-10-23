import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { User } from '../entities/user.entity';
import { UserAddress } from '../entities/user-address.entity';
import { TableReservation } from '../entities/table-reservation.entity';
import { CreateOrderDto, OrderResponseDto, OrderItemResponseDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(TableReservation)
    private readonly tableReservationRepository: Repository<TableReservation>,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const {
      order_type,
      delivery_country,
      delivery_city,
      delivery_street_address,
      delivery_phone,
      reservation_id,
      should_update_user_address = false,
    } = createOrderDto;

    // Выполняем создание заказа через транзакционную функцию БД
    try {
      const result = await this.dataSource.query(
        `SELECT create_order_from_cart_transactional($1, $2, $3, $4, $5, $6, $7, $8) as result`,
        [
          userId,
          order_type,
          delivery_country || null,
          delivery_city || null,
          delivery_street_address || null,
          delivery_phone || null,
          reservation_id || null,
          should_update_user_address,
        ],
      );

      const functionResult = result[0]?.result;
      if (!functionResult || functionResult.status !== 'ok') {
        throw new BadRequestException(
          functionResult?.message || 'Ошибка при создании заказа',
        );
      }

      // Получаем созданный заказ с детализацией
      const order = await this.getOrderById(functionResult.order_id);
      return order;
    } catch (error) {
      if (error.message.includes('User cart not found')) {
        throw new NotFoundException('Корзина пользователя не найдена');
      }
      if (error.message.includes('Cart is empty')) {
        throw new BadRequestException('Корзина пуста');
      }
      if (error.message.includes('Reservation not found')) {
        throw new NotFoundException(
          'Бронирование не найдено или не принадлежит пользователю',
        );
      }
      if (error.message.includes('reservation status is')) {
        throw new BadRequestException(
          'Нельзя создать заказ в ресторане: бронирование не в статусе "начато"',
        );
      }
      if (error.message.includes('No restaurant found')) {
        throw new BadRequestException(
          'В указанном городе нет ресторанов. Доставка недоступна',
        );
      }
      if (error.message.includes('All delivery fields')) {
        throw new BadRequestException(
          'Для заказа с доставкой необходимо указать все адресные данные',
        );
      }
      if (error.message.includes('Delivery fields must not be provided')) {
        throw new BadRequestException(
          'Для заказа в ресторане адресные данные указывать не нужно',
        );
      }
      if (error.message.includes('Reservation ID is required')) {
        throw new BadRequestException(
          'Для заказа в ресторане необходимо указать ID бронирования',
        );
      }
      if (error.message.includes('Reservation ID must not be provided')) {
        throw new BadRequestException(
          'Для заказа с доставкой ID бронирования указывать не нужно',
        );
      }

      // Если это другая ошибка валидации или ошибка БД
      throw new BadRequestException(
        error.message || 'Ошибка при создании заказа',
      );
    }
  }

  async getOrderById(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    // Получаем позиции заказа с информацией о блюдах
    const orderItems = await this.dataSource.query(
      `
      SELECT 
        oi.order_item_id,
        oi.item_id,
        mi.item_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price
      FROM order_items oi
      JOIN menu_items mi ON oi.item_id = mi.item_id
      WHERE oi.order_id = $1
      ORDER BY oi.order_item_id
      `,
      [orderId],
    );

    return this.mapToResponseDto(order, orderItems);
  }

  async getUserOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.dataSource.query(
          `
          SELECT 
            oi.order_item_id,
            oi.item_id,
            mi.item_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price
          FROM order_items oi
          JOIN menu_items mi ON oi.item_id = mi.item_id
          WHERE oi.order_id = $1
          ORDER BY oi.order_item_id
          `,
          [order.order_id],
        );

        return this.mapToResponseDto(order, orderItems);
      }),
    );

    return ordersWithItems;
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      order: { created_at: 'DESC' },
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.dataSource.query(
          `
          SELECT 
            oi.order_item_id,
            oi.item_id,
            mi.item_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price
          FROM order_items oi
          JOIN menu_items mi ON oi.item_id = mi.item_id
          WHERE oi.order_id = $1
          ORDER BY oi.order_item_id
          `,
          [order.order_id],
        );

        return this.mapToResponseDto(order, orderItems);
      }),
    );

    return ordersWithItems;
  }

  // Вспомогательный метод для получения адреса пользователя (для автозаполнения)
  async getUserAddress(userId: string): Promise<{
    country?: string;
    city?: string;
    street_address?: string;
  } | null> {
    const userAddress = await this.userAddressRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    if (!userAddress) {
      return null;
    }

    return {
      country: userAddress.country,
      city: userAddress.city,
      street_address: userAddress.street_address,
    };
  }

  private mapToResponseDto(
    order: Order,
    orderItems: any[] = [],
  ): OrderResponseDto {
    return {
      order_id: order.order_id,
      user_id: order.user_id,
      order_type: order.order_type,
      delivery_country: order.delivery_country,
      delivery_city: order.delivery_city,
      delivery_street_address: order.delivery_street_address,
      delivery_phone: order.delivery_phone,
      reservation_id: order.reservation_id,
      subtotal: parseFloat(order.subtotal.toString()),
      delivery_fee: parseFloat(order.delivery_fee.toString()),
      total_amount: parseFloat(order.total_amount.toString()),
      created_at: order.created_at,
      updated_at: order.updated_at,
      order_items: orderItems.map((item) => ({
        order_item_id: item.order_item_id,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.total_price),
      })),
    };
  }
}