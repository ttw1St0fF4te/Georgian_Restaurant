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
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const database_dump_service_1 = require("./database-dump.service");
let DatabaseController = class DatabaseController {
    constructor(databaseDumpService) {
        this.databaseDumpService = databaseDumpService;
    }
    async createDatabaseDump() {
        try {
            const result = await this.databaseDumpService.createDatabaseDump();
            return {
                success: true,
                message: 'Database dump created successfully',
                filePath: result.filePath,
                fileName: result.fileName
            };
        }
        catch (error) {
            throw new Error(`Failed to create database dump: ${error.message}`);
        }
    }
    async getDatabaseInfo() {
        return this.databaseDumpService.getDatabaseInfo();
    }
};
exports.DatabaseController = DatabaseController;
__decorate([
    (0, common_1.Post)('dump'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать полный дамп базы данных',
        description: 'Создает полный дамп базы данных с помощью pg_dump и сохраняет его на рабочий стол сервера'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Дамп базы данных создан успешно',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Database dump created successfully' },
                filePath: { type: 'string', example: '/Users/username/Desktop/db_dump_2025-10-25T12-00-00-000Z.sql' },
                fileName: { type: 'string', example: 'db_dump_2025-10-25T12-00-00-000Z.sql' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Ошибка создания дампа'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Недостаточно прав доступа'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "createDatabaseDump", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить информацию о базе данных',
        description: 'Возвращает основную информацию о подключении к базе данных'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Информация о базе данных получена',
        schema: {
            type: 'object',
            properties: {
                host: { type: 'string', example: 'localhost' },
                port: { type: 'string', example: '5432' },
                database: { type: 'string', example: 'restaurant_db' },
                user: { type: 'string', example: 'postgres' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "getDatabaseInfo", null);
exports.DatabaseController = DatabaseController = __decorate([
    (0, swagger_1.ApiTags)('database'),
    (0, common_1.Controller)('database'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [database_dump_service_1.DatabaseDumpService])
], DatabaseController);
//# sourceMappingURL=database.controller.js.map