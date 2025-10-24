import { ReservationsService } from './reservations.service';
import { CreateReservationDto, CreateReservationForUserDto, ReservationResponseDto, RestaurantTableAvailabilityDto } from './dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        username: string;
        role: string;
    };
}
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    createReservation(req: AuthenticatedRequest, createReservationDto: CreateReservationDto): Promise<ReservationResponseDto>;
    createReservationForUser(createReservationForUserDto: CreateReservationForUserDto): Promise<ReservationResponseDto>;
    getAllReservations(): Promise<ReservationResponseDto[]>;
    getActiveReservations(): Promise<ReservationResponseDto[]>;
    getInactiveReservations(): Promise<ReservationResponseDto[]>;
    getTableAvailability(restaurantId: number, tableId: number, date: string): Promise<RestaurantTableAvailabilityDto>;
    getUserReservations(req: AuthenticatedRequest): Promise<ReservationResponseDto[]>;
    getUserActiveReservations(req: AuthenticatedRequest): Promise<ReservationResponseDto[]>;
    confirmReservation(req: AuthenticatedRequest, reservationId: string): Promise<ReservationResponseDto>;
    cancelReservation(req: AuthenticatedRequest, reservationId: string): Promise<ReservationResponseDto>;
    confirmReservationForManager(reservationId: string): Promise<ReservationResponseDto>;
    cancelReservationForManager(reservationId: string): Promise<ReservationResponseDto>;
}
export {};
