import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
    getDatabaseHealth(): Promise<{
        status: string;
        database: string;
        connected: boolean;
    }>;
    getDatabaseInfo(): Promise<any>;
}
