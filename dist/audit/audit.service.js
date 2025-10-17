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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditService = class AuditService {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async getRecentAuditLogs(limit = 50) {
        return this.auditRepository.find({
            order: { changed_at: 'DESC' },
            take: limit,
        });
    }
    async getAuditLogs(filter) {
        const queryBuilder = this.auditRepository.createQueryBuilder('audit');
        if (filter.tableName) {
            queryBuilder.andWhere('audit.table_name = :tableName', {
                tableName: filter.tableName
            });
        }
        if (filter.operation) {
            queryBuilder.andWhere('audit.operation = :operation', {
                operation: filter.operation
            });
        }
        if (filter.changedBy) {
            queryBuilder.andWhere('audit.changed_by = :changedBy', {
                changedBy: filter.changedBy
            });
        }
        if (filter.recordId) {
            queryBuilder.andWhere('audit.record_id = :recordId', {
                recordId: filter.recordId
            });
        }
        if (filter.dateFrom) {
            queryBuilder.andWhere('audit.changed_at >= :dateFrom', {
                dateFrom: filter.dateFrom
            });
        }
        if (filter.dateTo) {
            queryBuilder.andWhere('audit.changed_at <= :dateTo', {
                dateTo: filter.dateTo
            });
        }
        queryBuilder.orderBy('audit.changed_at', 'DESC');
        if (filter.limit) {
            queryBuilder.take(filter.limit);
        }
        return queryBuilder.getMany();
    }
    async getRecordHistory(tableName, recordId) {
        return this.auditRepository.find({
            where: {
                table_name: tableName,
                record_id: recordId,
            },
            order: { changed_at: 'ASC' },
        });
    }
    async getAuditStatistics() {
        const stats = await this.auditRepository
            .createQueryBuilder('audit')
            .select([
            'audit.table_name',
            'audit.operation',
            'COUNT(*) as count'
        ])
            .groupBy('audit.table_name, audit.operation')
            .getRawMany();
        const tableStats = await this.auditRepository
            .createQueryBuilder('audit')
            .select([
            'audit.table_name',
            'COUNT(*) as total_operations',
            'COUNT(CASE WHEN audit.operation = \'INSERT\' THEN 1 END) as inserts',
            'COUNT(CASE WHEN audit.operation = \'UPDATE\' THEN 1 END) as updates',
            'COUNT(CASE WHEN audit.operation = \'DELETE\' THEN 1 END) as deletes'
        ])
            .groupBy('audit.table_name')
            .getRawMany();
        return {
            operationStats: stats,
            tableStats: tableStats,
        };
    }
    async getRecentChanges(days = 7) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);
        return this.getAuditLogs({
            dateFrom,
            limit: 100
        });
    }
    async getUserActivity(username, limit = 50) {
        return this.getAuditLogs({
            changedBy: username,
            limit,
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditService);
//# sourceMappingURL=audit.service.js.map