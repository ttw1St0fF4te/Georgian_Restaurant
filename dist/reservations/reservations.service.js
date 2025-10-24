"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const table_reservation_entity_1 = require("../entities/table-reservation.entity");
const table_entity_1 = require("../entities/table.entity");
const restaurant_entity_1 = require("../entities/restaurant.entity");
const user_entity_1 = require("../entities/user.entity");
let ReservationsService = class ReservationsService {
    constructor(reservationRepository, tableRepository, restaurantRepository, userRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }
    async createReservation(userId, createReservationDto) {
        const { restaurant_id, table_id, reservation_date, reservation_time, duration_hours, guests_count, contact_phone, } = createReservationDto;
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Ресторан не найден');
        }
        const table = await this.tableRepository.findOne({
            where: { table_id, restaurant_id },
        });
        if (!table) {
            throw new common_1.NotFoundException('Столик не найден или не принадлежит выбранному ресторану');
        }
        if (guests_count > table.seats_count) {
            throw new common_1.BadRequestException(`Количество гостей (${guests_count}) превышает вместимость столика (${table.seats_count} мест)`);
        }
        const reservationDate = new Date(reservation_date);
        const moscowNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const today = new Date(moscowNow.toDateString());
        const currentTime = moscowNow.getHours().toString().padStart(2, '0') + ':' +
            moscowNow.getMinutes().toString().padStart(2, '0');
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 1);
        if (reservationDate < today || reservationDate > maxDate) {
            throw new common_1.BadRequestException(`Бронирование доступно только с сегодня (${today.toISOString().split('T')[0]}) до ${maxDate.toISOString().split('T')[0]} включительно`);
        }
        if (reservationDate.toDateString() === today.toDateString()) {
            if (reservation_time <= currentTime) {
                throw new common_1.BadRequestException(`Нельзя забронировать время в прошлом. Текущее время: ${currentTime}`);
            }
        }
        const dayOfWeek = this.getDayOfWeek(reservationDate);
        const isRestaurantOpen = this.isRestaurantOpenOnDay(restaurant.working_hours, dayOfWeek, reservation_time, duration_hours);
        if (!isRestaurantOpen.isOpen) {
            throw new common_1.BadRequestException(isRestaurantOpen.message);
        }
        const activeReservation = await this.reservationRepository.findOne({
            where: {
                user_id: userId,
                reservation_status: (0, typeorm_2.In)([
                    table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
                    table_reservation_entity_1.ReservationStatus.CONFIRMED,
                    table_reservation_entity_1.ReservationStatus.STARTED,
                ]),
            },
        });
        if (activeReservation) {
            throw new common_1.ConflictException('У вас уже есть активное бронирование. Завершите его перед созданием нового.');
        }
        const conflictingReservations = await this.checkTimeConflicts(table_id, reservation_date, reservation_time, duration_hours);
        if (conflictingReservations.length > 0) {
            const conflictTimes = conflictingReservations.map((r) => `${r.reservation_time} - ${this.calculateEndTime(r.reservation_time, r.duration_hours)}`);
            throw new common_1.ConflictException(`Столик занят в указанное время. Занятые интервалы: ${conflictTimes.join(', ')}`);
        }
        const reservation = this.reservationRepository.create({
            user_id: userId,
            restaurant_id,
            table_id,
            reservation_date,
            reservation_time,
            duration_hours,
            guests_count,
            contact_phone,
            reservation_status: table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
        });
        const savedReservation = await this.reservationRepository.save(reservation);
        return this.mapToResponseDto(savedReservation, restaurant, table);
    }
    getDayOfWeek(date) {
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
    isRestaurantOpenOnDay(workingHours, dayOfWeek, reservationTime, durationHours) {
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
        if (reservationStart < restaurantOpen) {
            return {
                isOpen: false,
                message: `Ресторан открывается в ${openTime}`,
            };
        }
        if (reservationEnd > restaurantClose) {
            const maxDuration = Math.floor((restaurantClose - reservationStart) / 60);
            return {
                isOpen: false,
                message: `Ресторан закрывается в ${closeTime}. Максимальная продолжительность для времени ${reservationTime}: ${maxDuration} час(ов)`,
            };
        }
        return { isOpen: true };
    }
    getDayName(dayOfWeek) {
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
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    calculateEndTime(startTime, durationHours) {
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = startMinutes + durationHours * 60;
        const endHours = Math.floor(endMinutes / 60);
        const remainingMinutes = endMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
    async checkTimeConflicts(tableId, reservationDate, reservationTime, durationHours) {
        const activeStatuses = [
            table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
            table_reservation_entity_1.ReservationStatus.CONFIRMED,
            table_reservation_entity_1.ReservationStatus.STARTED,
        ];
        const reservations = await this.reservationRepository.find({
            where: {
                table_id: tableId,
                reservation_date: reservationDate,
                reservation_status: (0, typeorm_2.In)(activeStatuses),
            },
        });
        const newStart = this.timeToMinutes(reservationTime);
        const newEnd = newStart + durationHours * 60;
        return reservations.filter((reservation) => {
            const existingStart = this.timeToMinutes(reservation.reservation_time);
            const existingEnd = existingStart + reservation.duration_hours * 60;
            return newStart < existingEnd && newEnd > existingStart;
        });
    }
    async getAllReservations() {
        const reservations = await this.reservationRepository.find({
            relations: ['user', 'restaurant', 'table'],
            order: { created_at: 'DESC' },
        });
        return reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
    }
    async getActiveReservations() {
        const activeStatuses = [
            table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
            table_reservation_entity_1.ReservationStatus.CONFIRMED,
            table_reservation_entity_1.ReservationStatus.STARTED,
        ];
        const reservations = await this.reservationRepository.find({
            where: {
                reservation_status: (0, typeorm_2.In)(activeStatuses),
            },
            relations: ['user', 'restaurant', 'table'],
            order: { reservation_date: 'ASC', reservation_time: 'ASC' },
        });
        return reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
    }
    async getInactiveReservations() {
        const inactiveStatuses = [table_reservation_entity_1.ReservationStatus.COMPLETED, table_reservation_entity_1.ReservationStatus.CANCELLED];
        const reservations = await this.reservationRepository.find({
            where: {
                reservation_status: (0, typeorm_2.In)(inactiveStatuses),
            },
            relations: ['user', 'restaurant', 'table'],
            order: { updated_at: 'DESC' },
        });
        return reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
    }
    async getActiveReservationsByRestaurantDateTable(restaurantId, reservationDate, tableId) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id: restaurantId },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Ресторан не найден');
        }
        const table = await this.tableRepository.findOne({
            where: { table_id: tableId, restaurant_id: restaurantId },
        });
        if (!table) {
            throw new common_1.NotFoundException('Столик не найден или не принадлежит выбранному ресторану');
        }
        const activeStatuses = [
            table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
            table_reservation_entity_1.ReservationStatus.CONFIRMED,
            table_reservation_entity_1.ReservationStatus.STARTED,
        ];
        const reservations = await this.reservationRepository.find({
            where: {
                restaurant_id: restaurantId,
                table_id: tableId,
                reservation_date: reservationDate,
                reservation_status: (0, typeorm_2.In)(activeStatuses),
            },
            relations: ['user', 'restaurant', 'table'],
            order: { reservation_time: 'ASC' },
        });
        const reservationDtos = reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
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
    async getUserReservations(userId) {
        const reservations = await this.reservationRepository.find({
            where: { user_id: userId },
            relations: ['user', 'restaurant', 'table'],
            order: { created_at: 'DESC' },
        });
        return reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
    }
    async getUserActiveReservations(userId) {
        const activeStatuses = [
            table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
            table_reservation_entity_1.ReservationStatus.CONFIRMED,
            table_reservation_entity_1.ReservationStatus.STARTED,
        ];
        const reservations = await this.reservationRepository.find({
            where: {
                user_id: userId,
                reservation_status: (0, typeorm_2.In)(activeStatuses),
            },
            relations: ['user', 'restaurant', 'table'],
            order: { reservation_date: 'ASC', reservation_time: 'ASC' },
        });
        return reservations.map((reservation) => this.mapToResponseDto(reservation, reservation.restaurant, reservation.table));
    }
    async confirmReservation(userId, reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservation_id: reservationId, user_id: userId },
            relations: ['restaurant', 'table'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Бронирование не найдено или не принадлежит вам');
        }
        if (reservation.reservation_status !== table_reservation_entity_1.ReservationStatus.UNCONFIRMED) {
            throw new common_1.BadRequestException(`Можно подтвердить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`);
        }
        reservation.reservation_status = table_reservation_entity_1.ReservationStatus.CONFIRMED;
        reservation.confirmed_at = new Date();
        reservation.updated_at = new Date();
        const updatedReservation = await this.reservationRepository.save(reservation);
        return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
    }
    async cancelReservation(userId, reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservation_id: reservationId, user_id: userId },
            relations: ['restaurant', 'table'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Бронирование не найдено или не принадлежит вам');
        }
        if (reservation.reservation_status !== table_reservation_entity_1.ReservationStatus.UNCONFIRMED) {
            throw new common_1.BadRequestException(`Можно отменить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`);
        }
        reservation.reservation_status = table_reservation_entity_1.ReservationStatus.CANCELLED;
        reservation.updated_at = new Date();
        const updatedReservation = await this.reservationRepository.save(reservation);
        return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
    }
    async confirmReservationForManager(reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservation_id: reservationId },
            relations: ['restaurant', 'table'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Бронирование не найдено');
        }
        if (reservation.reservation_status !== table_reservation_entity_1.ReservationStatus.UNCONFIRMED) {
            throw new common_1.BadRequestException(`Можно подтвердить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`);
        }
        reservation.reservation_status = table_reservation_entity_1.ReservationStatus.CONFIRMED;
        reservation.confirmed_at = new Date();
        reservation.updated_at = new Date();
        const updatedReservation = await this.reservationRepository.save(reservation);
        return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
    }
    async cancelReservationForManager(reservationId) {
        const reservation = await this.reservationRepository.findOne({
            where: { reservation_id: reservationId },
            relations: ['restaurant', 'table'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Бронирование не найдено');
        }
        if (reservation.reservation_status !== table_reservation_entity_1.ReservationStatus.UNCONFIRMED) {
            throw new common_1.BadRequestException(`Можно отменить только неподтвержденные бронирования. Текущий статус: ${reservation.reservation_status}`);
        }
        reservation.reservation_status = table_reservation_entity_1.ReservationStatus.CANCELLED;
        reservation.updated_at = new Date();
        const updatedReservation = await this.reservationRepository.save(reservation);
        return this.mapToResponseDto(updatedReservation, reservation.restaurant, reservation.table);
    }
    mapToResponseDto(reservation, restaurant, table) {
        let reservationDateStr;
        if (reservation.reservation_date instanceof Date) {
            reservationDateStr = reservation.reservation_date.toISOString().split('T')[0];
        }
        else {
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
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_reservation_entity_1.TableReservation)),
    __param(1, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(2, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map