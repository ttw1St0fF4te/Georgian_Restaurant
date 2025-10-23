import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        username: string;
        role: string;
    };
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: AuthenticatedRequest, createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
    getUserOrders(req: AuthenticatedRequest): Promise<OrderResponseDto[]>;
    getUserAddress(req: AuthenticatedRequest): Promise<{
        country?: string;
        city?: string;
        street_address?: string;
    } | null>;
    getOrder(orderId: string): Promise<OrderResponseDto>;
    getAllOrders(): Promise<OrderResponseDto[]>;
}
export {};
