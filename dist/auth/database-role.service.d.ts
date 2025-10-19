import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare class DatabaseRoleService {
    private configService;
    private connections;
    constructor(configService: ConfigService);
    getConnectionForRole(role: string): Promise<DataSource>;
    private mapApplicationRoleToDbRole;
    private createConnectionForRole;
    closeAllConnections(): Promise<void>;
}
