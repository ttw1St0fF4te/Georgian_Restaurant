import { ConfigService } from '@nestjs/config';
export declare class DatabaseDumpService {
    private configService;
    constructor(configService: ConfigService);
    createDatabaseDump(): Promise<{
        filePath: string;
        fileName: string;
    }>;
    getDatabaseInfo(): Promise<{
        host: string;
        port: string;
        database: string;
        user: string;
    }>;
}
