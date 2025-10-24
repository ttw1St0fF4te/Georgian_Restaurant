import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesByDay(restaurantId: string | undefined, from: string, to: string): Promise<{
        day: string;
        total: number;
    }[]>;
    getOccupancy(restaurantId: string | undefined, from: string, to: string): Promise<{
        table_id: number;
        table_number?: number;
        reservations_count: number;
    }[]>;
    getUserVisits(from: string, to: string): Promise<{
        day: string;
        total_visits: number;
    }[]>;
    exportSalesCsv(restaurantId: number | undefined, from: string, to: string, res: Response): Promise<void>;
    exportOccupancyCsv(restaurantId: number | undefined, from: string, to: string, res: Response): Promise<void>;
    exportUserVisitsCsv(from: string, to: string, res: Response): Promise<void>;
    exportAllDataCsv(restaurantId: number | undefined, from: string, to: string, res: Response): Promise<void>;
}
