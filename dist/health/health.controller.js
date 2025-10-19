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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealth() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'Georgian Restaurant API',
        };
    }
    async getDatabaseHealth() {
        return this.healthService.checkDatabaseConnection();
    }
    async getDatabaseInfo() {
        return this.healthService.getDatabaseInfo();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Проверка работоспособности API',
        description: 'Возвращает статус работоспособности Georgian Restaurant API'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API работает нормально',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'OK' },
                timestamp: { type: 'string', format: 'date-time' },
                service: { type: 'string', example: 'Georgian Restaurant API' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('db'),
    (0, swagger_1.ApiOperation)({
        summary: 'Проверка подключения к базе данных',
        description: 'Проверяет состояние подключения к PostgreSQL базе данных'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'База данных доступна',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'OK' },
                database: { type: 'string', example: 'gr_db2' },
                connected: { type: 'boolean', example: true }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDatabaseHealth", null);
__decorate([
    (0, common_1.Get)('db/info'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить подробную информацию о базе данных',
        description: 'Возвращает версию PostgreSQL, имя БД и пользователя'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Информация о базе данных получена',
        schema: {
            type: 'object',
            properties: {
                version: { type: 'string', example: 'PostgreSQL 14.9' },
                database: { type: 'string', example: 'gr_db2' },
                user: { type: 'string', example: 'restaurant_admin' },
                connection_status: { type: 'string', example: 'active' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDatabaseInfo", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map