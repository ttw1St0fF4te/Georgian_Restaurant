import { DatabaseDumpService } from './database-dump.service';
export declare class DatabaseController {
    private readonly databaseDumpService;
    constructor(databaseDumpService: DatabaseDumpService);
    createDatabaseDump(): Promise<{
        success: boolean;
        message: string;
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
