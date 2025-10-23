import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { User } from '../entities/user.entity';
import { UserAddress } from '../entities/user-address.entity';
import { TableReservation } from '../entities/table-reservation.entity';
import { CreateOrderDto, OrderResponseDto } from './dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly cartRepository;
    private readonly cartItemRepository;
    private readonly userRepository;
    private readonly userAddressRepository;
    private readonly tableReservationRepository;
    private readonly dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, userRepository: Repository<User>, userAddressRepository: Repository<UserAddress>, tableReservationRepository: Repository<TableReservation>, dataSource: DataSource);
    createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    getOrderById(orderId: string): Promise<OrderResponseDto>;
    getUserOrders(userId: string): Promise<OrderResponseDto[]>;
    getAllOrders(): Promise<OrderResponseDto[]>;
    getUserAddress(userId: string): Promise<{
        country?: string;
        city?: string;
        street_address?: string;
    } | null>;
    private mapToResponseDto;
}
