import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { TableReservation, ReservationStatus } from '../entities/table-reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant, WorkingHours } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { CreateReservationDto, ReservationResponseDto } from './dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(TableReservation)
    private readonly reservationRepository: Repository<TableReservation>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReservation(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    const {
      restaurant_id,
      table_id,
      reservation_date,
      reservation_time,
      duration_hours,
      guests_count,
      contact_phone,
    } = createReservationDto;

    // Проверяем, существует ли пользователь
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем, существует ли ресторан
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id },
    });
    if (!restaurant) {
      throw new NotFoundException('Ресторан не найден');
    }

    // Проверяем, существует ли столик и принадлежит ли он выбранному ресторану
    const table = await this.tableRepository.findOne({
      where: { table_id, restaurant_id },
    });
    if (!table) {
      throw new NotFoundException(
        'Столик не найден или не принадлежит выбранному ресторану',
      );
    }

    // Проверяем, что количество гостей не превышает вместимость столика
    if (guests_count > table.seats_count) {
      throw new BadRequestException(
        `Количество гостей (${guests_count}) превышает вместимость столика (${table.seats_count} мест)`,
      );
    }

    const reservationDate = new Date(reservation_date);
    const moscowNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    const today = new Date(moscowNow.toDateString());
    const currentTime = moscowNow.getHours().toString().padStart(2, '0') + ':' +
                       moscowNow.getMinutes().toString().padStart(2, '0');

    // Проверяем диапазон дат бронирования (с сегодня до месяца вперед)
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 1);

    if (reservationDate < today || reservationDate > maxDate) {
      throw new BadRequestException(
        `Бронирование доступно только с сегодня (${today.toISOString().split('T')[0]}) до ${maxDate.toISOString().split('T')[0]} включительно`,
      );
    }

    // Если бронирование на сегодня, проверяем текущее время
    if (reservationDate.toDateString() === today.toDateString()) {
      if (reservation_time <= currentTime) {
        throw new BadRequestException(
          `Нельзя забронировать время в прошлом. Текущее время: ${currentTime}`,
        );
      }
    }

    // Проверяем рабочие часы ресторана
    const dayOfWeek = this.getDayOfWeek(reservationDate);
    const isRestaurantOpen = this.isRestaurantOpenOnDay(
      restaurant.working_hours,
      dayOfWeek,
      reservation_time,
      duration_hours,
    );

    if (!isRestaurantOpen.isOpen) {
      throw new BadRequestException(isRestaurantOpen.message);
    }

    // Проверяем, есть ли у пользователя активные бронирования
    const activeReservation = await this.reservationRepository.findOne({
      where: {
        user_id: userId,
        reservation_status: In([
          ReservationStatus.UNCONFIRMED,
          ReservationStatus.CONFIRMED,
          ReservationStatus.STARTED,
        ]),
      },
    });

    if (activeReservation) {
      throw new ConflictException(
        'У вас уже есть активное бронирование. Завершите его перед созданием нового.',
      );
    }

    // Проверяем конфликты времени с другими активными бронированиями столика
    const conflictingReservations = await this.checkTimeConflicts(
      table_id,
      reservation_date,
      reservation_time,
      duration_hours,
    );

    if (conflictingReservations.length > 0) {
      const conflictTimes = conflictingReservations.map(
        (r) =>
          `${r.reservation_time} - ${this.calculateEndTime(
            r.reservation_time,
            r.duration_hours,
          )}`,
      );
      throw new ConflictException(
        `Столик занят в указанное время. Занятые интервалы: ${conflictTimes.join(', ')}`,
      );
    }

    // Создаем бронирование
    const reservation = this.reservationRepository.create({
      user_id: userId,
      restaurant_id,
      table_id,
      reservation_date,
      reservation_time,
      duration_hours,
      guests_count,
      contact_phone,
      reservation_status: ReservationStatus.UNCONFIRMED,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Возвращаем результат с дополнительной информацией
    return this.mapToResponseDto(savedReservation, restaurant, table);
  }

  private getDayOfWeek(date: Date): string {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[date.getDay()];
  }

  private isRestaurantOpenOnDay(
    workingHours: WorkingHours,
    dayOfWeek: string,
    reservationTime: string,
    durationHours: number,
  ): { isOpen: boolean; message?: string } {
    if (!workingHours || !workingHours[dayOfWeek]) {
      return {
        isOpen: false,
        message: `Ресторан закрыт в ${this.getDayName(dayOfWeek)}`,
      };
    }

    const dayHours = workingHours[dayOfWeek];
    if (dayHours === 'closed' || !dayHours.includes('-')) {
      return {
        isOpen: false,
        message: `Ресторан закрыт в ${this.getDayName(dayOfWeek)}`,
      };
    }

    const [openTime, closeTime] = dayHours.split('-');
    const reservationStart = this.timeToMinutes(reservationTime);
    const reservationEnd = reservationStart + durationHours * 60;
    const restaurantOpen = this.timeToMinutes(openTime);
    const restaurantClose = this.timeToMinutes(closeTime);

    // Проверяем, что бронирование начинается после открытия
    if (reservationStart < restaurantOpen) {
      return {
        isOpen: false,
        message: `Ресторан открывается в ${openTime}`,
      };
    }

    // Проверяем, что бронирование заканчивается до закрытия
    if (reservationEnd > restaurantClose) {
      const maxDuration = Math.floor((restaurantClose - reservationStart) / 60);
      return {
        isOpen: false,
        message: `Ресторан закрывается в ${closeTime}. Максимальная продолжительность для времени ${reservationTime}: ${maxDuration} час(ов)`,
      };
    }

    return { isOpen: true };
  }

  private getDayName(dayOfWeek: string): string {
    const dayNames = {
      monday: 'понедельник',
      tuesday: 'вторник',
      wednesday: 'среду',
      thursday: 'четверг',
      friday: 'пятницу',
      saturday: 'субботу',
      sunday: 'воскресенье',
    };
    return dayNames[dayOfWeek] || dayOfWeek;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private calculateEndTime(startTime: string, durationHours: number): string {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = startMinutes + durationHours * 60;
    const endHours = Math.floor(endMinutes / 60);
    const remainingMinutes = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }

  private async checkTimeConflicts(
    tableId: number,
    reservationDate: string,
    reservationTime: string,
    durationHours: number,
  ): Promise<TableReservation[]> {
    const activeStatuses = [
      ReservationStatus.UNCONFIRMED,
      ReservationStatus.CONFIRMED,
      ReservationStatus.STARTED,
    ];

    const reservations = await this.reservationRepository.find({
      where: {
        table_id: tableId,
        reservation_date: reservationDate as any,
        reservation_status: In(activeStatuses),
      },
    });

    const newStart = this.timeToMinutes(reservationTime);
    const newEnd = newStart + durationHours * 60;

    return reservations.filter((reservation) => {
      const existingStart = this.timeToMinutes(reservation.reservation_time);
      const existingEnd = existingStart + reservation.duration_hours * 60;

      // Проверяем пересечение интервалов
      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  async getAllReservations(): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepository.find({
      relations: ['user', 'restaurant', 'table'],
      order: { created_at: 'DESC' },
    });

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );
  }

  async getActiveReservations(): Promise<ReservationResponseDto[]> {
    const activeStatuses = [
      ReservationStatus.UNCONFIRMED,
      ReservationStatus.CONFIRMED,
      ReservationStatus.STARTED,
    ];

    const reservations = await this.reservationRepository.find({
      where: {
        reservation_status: In(activeStatuses),
      },
      relations: ['user', 'restaurant', 'table'],
      order: { reservation_date: 'ASC', reservation_time: 'ASC' },
    });

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );
  }

  async getInactiveReservations(): Promise<ReservationResponseDto[]> {
    const inactiveStatuses = [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED];

    const reservations = await this.reservationRepository.find({
      where: {
        reservation_status: In(inactiveStatuses),
      },
      relations: ['user', 'restaurant', 'table'],
      order: { updated_at: 'DESC' },
    });

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );
  }

  async getActiveReservationsByRestaurantDateTable(
    restaurantId: number,
    reservationDate: string,
    tableId: number,
  ): Promise<{
    reservations: ReservationResponseDto[];
    occupiedTimeSlots: { start: string; end: string; reservation_id: string }[];
  }> {
    // Проверяем, существует ли ресторан
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException('Ресторан не найден');
    }

    // Проверяем, существует ли столик и принадлежит ли он ресторану
    const table = await this.tableRepository.findOne({
      where: { table_id: tableId, restaurant_id: restaurantId },
    });
    if (!table) {
      throw new NotFoundException(
        'Столик не найден или не принадлежит выбранному ресторану',
      );
    }

    const activeStatuses = [
      ReservationStatus.UNCONFIRMED,
      ReservationStatus.CONFIRMED,
      ReservationStatus.STARTED,
    ];

    const reservations = await this.reservationRepository.find({
      where: {
        restaurant_id: restaurantId,
        table_id: tableId,
        reservation_date: reservationDate as any,
        reservation_status: In(activeStatuses),
      },
      relations: ['user', 'restaurant', 'table'],
      order: { reservation_time: 'ASC' },
    });

    const reservationDtos = reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );

    // Создаем список занятых временных слотов
    const occupiedTimeSlots = reservations.map((reservation) => ({
      start: reservation.reservation_time,
      end: this.calculateEndTime(reservation.reservation_time, reservation.duration_hours),
      reservation_id: reservation.reservation_id,
    }));

    return {
      reservations: reservationDtos,
      occupiedTimeSlots,
    };
  }

  async getUserReservations(userId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepository.find({
      where: { user_id: userId },
      relations: ['user', 'restaurant', 'table'],
      order: { created_at: 'DESC' },
    });

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );
  }

  async getUserActiveReservations(userId: string): Promise<ReservationResponseDto[]> {
    const activeStatuses = [
      ReservationStatus.UNCONFIRMED,
      ReservationStatus.CONFIRMED,
      ReservationStatus.STARTED,
    ];

    const reservations = await this.reservationRepository.find({
      where: {
        user_id: userId,
        reservation_status: In(activeStatuses),
      },
      relations: ['user', 'restaurant', 'table'],
      order: { reservation_date: 'ASC', reservation_time: 'ASC' },
    });

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation, reservation.restaurant, reservation.table),
    );
  }

  async confirmReservation(userId: string, reservationId: string): Promise<ReservationResponseDto> {
    // Проверяем, что бронирование существует и принадлежит пользователю
    const reservation = await this.reservationRepository.findOne({
      where: { reservation_id: reservationId, user_id: userId },
      relations: ['restaurant', 'table'],
    });

    if (!reservation) {
      throw new NotFoundException('Бронирование не найдено или не принадлежит вам');
    }

    // Проверяем, что статус позволяет подтверждение
    if (reservation.reservation_status !== ReservationStatus.UNCONFIRMED) {
      throw new BadRequestException(
        `Можно подтвердить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`,
      );
    }

    // Обновляем статус и устанавливаем время подтверждения
    reservation.reservation_status = ReservationStatus.CONFIRMED;
    reservation.confirmed_at = new Date();
    reservation.updated_at = new Date();

    const updatedReservation = await this.reservationRepository.save(reservation);

    return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
  }

  async cancelReservation(userId: string, reservationId: string): Promise<ReservationResponseDto> {
    // Проверяем, что бронирование существует и принадлежит пользователю
    const reservation = await this.reservationRepository.findOne({
      where: { reservation_id: reservationId, user_id: userId },
      relations: ['restaurant', 'table'],
    });

    if (!reservation) {
      throw new NotFoundException('Бронирование не найдено или не принадлежит вам');
    }

    // Проверяем, что статус позволяет отмену
    if (reservation.reservation_status !== ReservationStatus.UNCONFIRMED) {
      throw new BadRequestException(
        `Можно отменить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`,
      );
    }

    // Обновляем статус на отмененный
    reservation.reservation_status = ReservationStatus.CANCELLED;
    reservation.updated_at = new Date();

    const updatedReservation = await this.reservationRepository.save(reservation);

    return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
  }

  private mapToResponseDto(
    reservation: TableReservation,
    restaurant: Restaurant,
    table: Table,
  ): ReservationResponseDto {
    // Преобразуем дату в строку, учитывая что она может быть как Date, так и строкой
    let reservationDateStr: string;
    if (reservation.reservation_date instanceof Date) {
      reservationDateStr = reservation.reservation_date.toISOString().split('T')[0];
    } else {
      // приводим к строке и обрабатываем
      const dateAsString = String(reservation.reservation_date);
      reservationDateStr = dateAsString.includes('T') 
        ? dateAsString.split('T')[0] 
        : dateAsString;
    }

    return {
      reservation_id: reservation.reservation_id,
      user_id: reservation.user_id,
      restaurant_id: reservation.restaurant_id,
      restaurant_name: restaurant.restaurant_name,
      table_id: reservation.table_id,
      table_number: table.table_number,
      seats_count: table.seats_count,
      reservation_date: reservationDateStr,
      reservation_time: reservation.reservation_time,
      duration_hours: reservation.duration_hours,
      guests_count: reservation.guests_count,
      reservation_status: reservation.reservation_status,
      contact_phone: reservation.contact_phone,
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
      confirmed_at: reservation.confirmed_at,
    };
  }
}