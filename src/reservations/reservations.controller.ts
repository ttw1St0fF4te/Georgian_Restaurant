import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ReservationsService } from './reservations.service';
import { 
  CreateReservationDto,
  CreateReservationForUserDto,
  ReservationResponseDto, 
  RestaurantTableAvailabilityDto 
} from './dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: string;
  };
}

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

    @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Создать новое бронирование столика',
    description: `
    Создает новое бронирование столика с проверкой всех бизнес-правил:
    - Один пользователь может иметь только одно активное бронирование
    - Столик должен принадлежать выбранному ресторану
    - Количество гостей не должно превышать вместимость столика
    - Бронирование возможно только в рабочие часы ресторана
    - Нельзя забронировать занятое время
    - Бронирование доступно с текущей даты на месяц вперед
    - Продолжительность от 1 до 8 часов
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Бронирование успешно создано',
    type: ReservationResponseDto,
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
          example: 'Количество гостей превышает вместимость столика',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Конфликт бронирования',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'У вас уже есть активное бронирование',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан или столик не найден',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Столик не найден или не принадлежит выбранному ресторану',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неавторизованный доступ',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async createReservation(
    @Req() req: AuthenticatedRequest,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const userId = req.user.userId;
    return this.reservationsService.createReservation(userId, createReservationDto);
  }

  @Post('for-user')
  @HttpCode(HttpStatus.CREATED)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Создать бронирование для пользователя (только менеджеры и администраторы)',
    description: `
    Создает новое бронирование для указанного пользователя. Доступно только менеджерам и администраторам.
    Проверяет все те же бизнес-правила, что и обычное создание бронирования.
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Бронирование успешно создано',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверные данные или нарушение бизнес-правил',
  })
  async createReservationForUser(
    @Body() createReservationForUserDto: CreateReservationForUserDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.createReservation(
      createReservationForUserDto.user_id, 
      createReservationForUserDto
    );
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Получить все бронирования',
    description: 'Возвращает список всех бронирований в системе (только для админов и менеджеров)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список всех бронирований',
    type: [ReservationResponseDto],
  })
  async getAllReservations(): Promise<ReservationResponseDto[]> {
    return this.reservationsService.getAllReservations();
  }

  @Get('active')
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Получить все активные бронирования',
    description: 'Возвращает список активных бронирований (unconfirmed, confirmed, started)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список активных бронирований',
    type: [ReservationResponseDto],
  })
  async getActiveReservations(): Promise<ReservationResponseDto[]> {
    return this.reservationsService.getActiveReservations();
  }

  @Get('inactive')
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Получить все неактивные бронирования',
    description: 'Возвращает список завершенных и отмененных бронирований',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список неактивных бронирований',
    type: [ReservationResponseDto],
  })
  async getInactiveReservations(): Promise<ReservationResponseDto[]> {
    return this.reservationsService.getInactiveReservations();
  }

  @Get('availability/:restaurantId/:tableId')
  @Public()
  @ApiOperation({
    summary: 'Получить доступность столика на определенную дату',
    description: 'Возвращает активные бронирования и занятые временные слоты для конкретного столика на выбранную дату',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID ресторана',
    example: 1,
  })
  @ApiParam({
    name: 'tableId',
    description: 'ID столика',
    example: 1,
  })
  @ApiQuery({
    name: 'date',
    description: 'Дата для проверки доступности (YYYY-MM-DD)',
    example: '2025-10-25',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Информация о доступности столика',
    type: RestaurantTableAvailabilityDto,
  })
  async getTableAvailability(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('tableId', ParseIntPipe) tableId: number,
    @Query('date') date: string,
  ): Promise<RestaurantTableAvailabilityDto> {
    return this.reservationsService.getActiveReservationsByRestaurantDateTable(
      restaurantId,
      date,
      tableId,
    );
  }

  @Get('my')
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Получить бронирования текущего пользователя',
    description: 'Возвращает все бронирования авторизованного пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список бронирований пользователя',
    type: [ReservationResponseDto],
  })
  async getUserReservations(@Req() req: AuthenticatedRequest): Promise<ReservationResponseDto[]> {
    const userId = req.user.userId;
    return this.reservationsService.getUserReservations(userId);
  }

  @Get('my/active')
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Получить активные бронирования текущего пользователя',
    description: 'Возвращает активные бронирования авторизованного пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список активных бронирований пользователя',
    type: [ReservationResponseDto],
  })
  async getUserActiveReservations(@Req() req: AuthenticatedRequest): Promise<ReservationResponseDto[]> {
    const userId = req.user.userId;
    return this.reservationsService.getUserActiveReservations(userId);
  }

  @Patch(':reservationId/confirm')
  @HttpCode(HttpStatus.OK)
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Подтвердить бронирование',
    description: `
    Подтверждает бронирование пользователя. Возможно только для бронирований со статусом 'unconfirmed'.
    При подтверждении статус меняется на 'confirmed' и устанавливается время подтверждения.
    `,
  })
  @ApiParam({
    name: 'reservationId',
    description: 'ID бронирования для подтверждения',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Бронирование успешно подтверждено',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Нельзя подтвердить бронирование с текущим статусом',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Можно подтвердить только неподтвержденные бронирования. Текущий статус: confirmed',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Бронирование не найдено или не принадлежит пользователю',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Бронирование не найдено или не принадлежит вам',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async confirmReservation(
    @Req() req: AuthenticatedRequest,
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationResponseDto> {
    const userId = req.user.userId;
    return this.reservationsService.confirmReservation(userId, reservationId);
  }

  @Patch(':reservationId/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles('user', 'manager', 'admin')
  @ApiOperation({
    summary: 'Отменить бронирование',
    description: `
    Отменяет бронирование пользователя. Возможно только для бронирований со статусом 'unconfirmed'.
    При отмене статус меняется на 'cancelled'.
    `,
  })
  @ApiParam({
    name: 'reservationId',
    description: 'ID бронирования для отмены',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Бронирование успешно отменено',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Нельзя отменить бронирование с текущим статусом',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Можно отменить только неподтвержденные бронирования. Текущий статус: confirmed',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Бронирование не найдено или не принадлежит пользователю',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Бронирование не найдено или не принадлежит вам',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async cancelReservation(
    @Req() req: AuthenticatedRequest,
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationResponseDto> {
    const userId = req.user.userId;
    return this.reservationsService.cancelReservation(userId, reservationId);
  }

  @Patch('manager/:reservationId/confirm')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Подтвердить бронирование (только для менеджеров)',
    description: `
    Подтверждает любое бронирование в системе. Доступно только менеджерам и администраторам.
    Возможно только для бронирований со статусом 'unconfirmed'.
    При подтверждении статус меняется на 'confirmed' и устанавливается время подтверждения.
    `,
  })
  @ApiParam({
    name: 'reservationId',
    description: 'ID бронирования для подтверждения',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Бронирование успешно подтверждено',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Нельзя подтвердить бронирование с текущим статусом',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Бронирование не найдено',
  })
  async confirmReservationForManager(
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.confirmReservationForManager(reservationId);
  }

  @Patch('manager/:reservationId/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Отменить бронирование (только для менеджеров)',
    description: `
    Отменяет любое бронирование в системе. Доступно только менеджерам и администраторам.
    Возможно только для бронирований со статусом 'unconfirmed'.
    При отмене статус меняется на 'cancelled'.
    `,
  })
  @ApiParam({
    name: 'reservationId',
    description: 'ID бронирования для отмены',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Бронирование успешно отменено',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Нельзя отменить бронирование с текущим статусом',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Бронирование не найдено',
  })
  async cancelReservationForManager(
    @Param('reservationId') reservationId: string,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.cancelReservationForManager(reservationId);
  }
}