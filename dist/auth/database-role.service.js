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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRoleService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
let DatabaseRoleService = class DatabaseRoleService {
    constructor(configService) {
        this.configService = configService;
        this.connections = new Map();
    }
    async getConnectionForRole(role) {
        const dbRole = this.mapApplicationRoleToDbRole(role);
        if (this.connections.has(dbRole)) {
            return this.connections.get(dbRole);
        }
        const connection = await this.createConnectionForRole(dbRole);
        this.connections.set(dbRole, connection);
        return connection;
    }
    mapApplicationRoleToDbRole(role) {
        const roleMapping = {
            admin: 'restaurant_admin',
            manager: 'restaurant_manager',
            user: 'restaurant_user',
            guest: 'restaurant_guest',
        };
        return roleMapping[role] || 'restaurant_guest';
    }
    async createConnectionForRole(dbRole) {
        const dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', 5432),
            username: dbRole,
            password: this.configService.get('DB_PASSWORD', 'new_secure_password!'),
            database: this.configService.get('DB_NAME', 'gr_db2'),
            entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
            logging: this.configService.get('NODE_ENV') === 'development',
            synchronize: false,
        });
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        return dataSource;
    }
    async closeAllConnections() {
        for (const [role, connection] of this.connections.entries()) {
            if (connection.isInitialized) {
                await connection.destroy();
            }
        }
        this.connections.clear();
    }
};
exports.DatabaseRoleService = DatabaseRoleService;
exports.DatabaseRoleService = DatabaseRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseRoleService);
//# sourceMappingURL=database-role.service.js.map