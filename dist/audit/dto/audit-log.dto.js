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
exports.AuditLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuditLogDto {
}
exports.AuditLogDto = AuditLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID записи аудита',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AuditLogDto.prototype, "log_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название таблицы',
        example: 'users',
    }),
    __metadata("design:type", String)
], AuditLogDto.prototype, "table_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID записи в таблице',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    __metadata("design:type", String)
], AuditLogDto.prototype, "record_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Операция (INSERT, UPDATE, DELETE)',
        example: 'UPDATE',
    }),
    __metadata("design:type", String)
], AuditLogDto.prototype, "operation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Старые значения (JSONB)',
        example: { name: 'Старое имя', email: 'old@example.com' },
        required: false,
    }),
    __metadata("design:type", Object)
], AuditLogDto.prototype, "old_values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Новые значения (JSONB)',
        example: { name: 'Новое имя', email: 'new@example.com' },
        required: false,
    }),
    __metadata("design:type", Object)
], AuditLogDto.prototype, "new_values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время операции',
        example: '2024-01-15T10:30:45.123Z',
    }),
    __metadata("design:type", String)
], AuditLogDto.prototype, "timestamp", void 0);
//# sourceMappingURL=audit-log.dto.js.map