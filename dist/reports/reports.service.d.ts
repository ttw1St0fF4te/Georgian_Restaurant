import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { TableReservation } from '../entities/table-reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
export declare class ReportsService {
    private readonly orderRepository;
    private readonly reservationRepository;
    private readonly tableRepository;
    private readonly restaurantRepository;
    private readonly userRepository;
    constructor(orderRepository: Repository<Order>, reservationRepository: Repository<TableReservation>, tableRepository: Repository<Table>, restaurantRepository: Repository<Restaurant>, userRepository: Repository<User>);
    getSalesByDay(restaurantId: number | null, from: string, to: string): Promise<Array<{
        day: string;
        total: number;
    }>>;
    getOccupancyByTable(restaurantId: number | null, from: string, to: string): Promise<Array<{
        table_id: number;
        table_number?: number;
        reservations_count: number;
    }>>;
    getUserVisits(from: string, to: string): Promise<Array<{
        day: string;
        total_visits: number;
    }>>;
    exportSalesCsv(restaurantId: number | null, from: string, to: string): Promise<{
        filename: string;
        csv: string;
    }>;
    exportOccupancyCsv(restaurantId: number | null, from: string, to: string): Promise<{
        filename: string;
        csv: string;
    }>;
    exportUserVisitsCsv(from: string, to: string): Promise<{
        filename: string;
        csv: string;
    }>;
    exportAllDataCsv(restaurantId: number | null, from: string, to: string): Promise<{
        filename: string;
        csv: string;
    }>;
}
