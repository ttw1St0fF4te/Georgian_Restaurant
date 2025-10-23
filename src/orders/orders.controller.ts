import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
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

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Создать заказ из корзины',
    description: `
    Создает заказ на основе содержимого корзины пользователя.
    
    Типы заказов:
    - delivery: Доставка на дом (требуется адрес доставки, взимается fee 5%)
    - dine_in: Заказ в ресторане (требуется активное бронирование со статусом 'started')
    
    Валидация:
    - Корзина не должна быть пустой
    - Для delivery: все адресные поля обязательны, должен быть активный ресторан в городе доставки
    - Для dine_in: reservation_id обязателен, бронирование должно быть в статусе 'started'
    - После создания заказа корзина очищается
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Заказ успешно создан',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверные данные или нарушение бизнес-правил',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Корзина пуста',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Корзина или бронирование не найдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Корзина пользователя не найдена',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const userId = req.user.userId;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get('my')
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Получить заказы текущего пользователя',
    description: 'Возвращает все заказы авторизованного пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список заказов пользователя',
    type: [OrderResponseDto],
  })
  async getUserOrders(
    @Req() req: AuthenticatedRequest,
  ): Promise<OrderResponseDto[]> {
    const userId = req.user.userId;
    return this.ordersService.getUserOrders(userId);
  }

  @Get('my/address')
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Получить адрес пользователя для автозаполнения',
    description: 'Возвращает адрес пользователя для автозаполнения при создании заказа с доставкой',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Адрес пользователя',
    schema: {
      type: 'object',
      properties: {
        country: { type: 'string', example: 'Грузия' },
        city: { type: 'string', example: 'Тбилиси' },
        street_address: { type: 'string', example: 'ул. Руставели, 15' },
      },
    },
  })
  async getUserAddress(
    @Req() req: AuthenticatedRequest,
  ): Promise<{
    country?: string;
    city?: string;
    street_address?: string;
  } | null> {
    const userId = req.user.userId;
    return this.ordersService.getUserAddress(userId);
  }

  @Get(':orderId')
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Получить заказ по ID',
    description: 'Возвращает детальную информацию о заказе',
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID заказа',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Информация о заказе',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Заказ не найден',
  })
  async getOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Получить все заказы',
    description: 'Возвращает все заказы в системе (только для админов и менеджеров)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список всех заказов',
    type: [OrderResponseDto],
  })
  async getAllOrders(): Promise<OrderResponseDto[]> {
    return this.ordersService.getAllOrders();
  }
}