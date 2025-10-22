import { Repository } from 'typeorm';
import { TableReservation } from '../entities/table-reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { CreateReservationDto, ReservationResponseDto } from './dto';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly tableRepository;
    private readonly restaurantRepository;
    private readonly userRepository;
    constructor(reservationRepository: Repository<TableReservation>, tableRepository: Repository<Table>, restaurantRepository: Repository<Restaurant>, userRepository: Repository<User>);
    createReservation(userId: string, createReservationDto: CreateReservationDto): Promise<ReservationResponseDto>;
    private getDayOfWeek;
    private isRestaurantOpenOnDay;
    private getDayName;
    private timeToMinutes;
    private calculateEndTime;
    private checkTimeConflicts;
    getAllReservations(): Promise<ReservationResponseDto[]>;
    getActiveReservations(): Promise<ReservationResponseDto[]>;
    getInactiveReservations(): Promise<ReservationResponseDto[]>;
    getActiveReservationsByRestaurantDateTable(restaurantId: number, reservationDate: string, tableId: number): Promise<{
        reservations: ReservationResponseDto[];
        occupiedTimeSlots: {
            start: string;
            end: string;
            reservation_id: string;
        }[];
    }>;
    getUserReservations(userId: string): Promise<ReservationResponseDto[]>;
    getUserActiveReservations(userId: string): Promise<ReservationResponseDto[]>;
    confirmReservation(userId: string, reservationId: string): Promise<ReservationResponseDto>;
    cancelReservation(userId: string, reservationId: string): Promise<ReservationResponseDto>;
    private mapToResponseDto;
}
