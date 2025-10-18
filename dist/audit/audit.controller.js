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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async getAuditLogs(tableName, operation, changedBy, recordId, limit) {
        const filter = {
            tableName,
            operation,
            changedBy,
            recordId,
            limit,
        };
        Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);
        return this.auditService.getAuditLogs(filter);
    }
    async getRecentAuditLogs(limit) {
        return this.auditService.getRecentAuditLogs(limit);
    }
    async getRecordHistory(tableName, recordId) {
        if (!tableName || !recordId) {
            throw new Error('Table name and record ID are required');
        }
        return this.auditService.getRecordHistory(tableName, recordId);
    }
    async getStatistics() {
        return this.auditService.getAuditStatistics();
    }
    async getRecentChanges(days) {
        return this.auditService.getRecentChanges(days);
    }
    async getUserActivity(username, limit) {
        if (!username) {
            throw new Error('Username is required');
        }
        return this.auditService.getUserActivity(username, limit);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить записи аудита с фильтрацией',
        description: 'Возвращает записи аудита с возможностью фильтрации по таблице, операции, пользователю и ID записи'
    }),
    (0, swagger_1.ApiQuery)({ name: 'table', required: false, description: 'Имя таблицы для фильтрации' }),
    (0, swagger_1.ApiQuery)({ name: 'operation', required: false, enum: audit_log_entity_1.AuditOperation, description: 'Тип операции (INSERT, UPDATE, DELETE)' }),
    (0, swagger_1.ApiQuery)({ name: 'user', required: false, description: 'Пользователь, выполнивший операцию' }),
    (0, swagger_1.ApiQuery)({ name: 'recordId', required: false, description: 'ID измененной записи' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Лимит записей (по умолчанию 50)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Записи аудита успешно получены' }),
    __param(0, (0, common_1.Query)('table')),
    __param(1, (0, common_1.Query)('operation')),
    __param(2, (0, common_1.Query)('user')),
    __param(3, (0, common_1.Query)('recordId')),
    __param(4, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить последние записи аудита',
        description: 'Возвращает последние записи аудита в порядке убывания по времени'
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Количество записей (по умолчанию 50)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Последние записи аудита получены' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getRecentAuditLogs", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('table')),
    __param(1, (0, common_1.Query)('recordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getRecordHistory", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить статистику аудита',
        description: 'Возвращает статистику операций аудита по таблицам и типам операций'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Статистика аудита получена',
        schema: {
            type: 'object',
            properties: {
                operationStats: { type: 'array', description: 'Статистика по операциям' },
                tableStats: { type: 'array', description: 'Статистика по таблицам' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('recent-changes'),
    __param(0, (0, common_1.Query)('days', new common_1.DefaultValuePipe(7), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getRecentChanges", null);
__decorate([
    (0, common_1.Get)('user-activity'),
    __param(0, (0, common_1.Query)('username')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getUserActivity", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('audit'),
    (0, common_1.Controller)('audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map