import { DataSource } from 'typeorm';
export declare class HealthService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    checkDatabaseConnection(): Promise<{
        status: string;
        database: string;
        connected: boolean;
    }>;
    getDatabaseInfo(): Promise<any>;
}
