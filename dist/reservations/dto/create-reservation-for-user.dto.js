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
exports.CreateReservationForUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateReservationForUserDto {
}
exports.CreateReservationForUserDto = CreateReservationForUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя, для которого создается бронирование',
        example: 'a32cc850-ee52-3ba6-7d8c-b47ce9470ed5',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReservationForUserDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID ресторана для бронирования',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReservationForUserDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID столика для бронирования',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReservationForUserDto.prototype, "table_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата бронирования (YYYY-MM-DD)',
        example: '2025-10-25',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReservationForUserDto.prototype, "reservation_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время начала бронирования (HH:MM)',
        example: '18:00',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReservationForUserDto.prototype, "reservation_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Продолжительность бронирования в часах (1-8)',
        example: 2,
        minimum: 1,
        maximum: 8,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReservationForUserDto.prototype, "duration_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество гостей',
        example: 4,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReservationForUserDto.prototype, "guests_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Контактный телефон',
        example: '+995555123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReservationForUserDto.prototype, "contact_phone", void 0);
//# sourceMappingURL=create-reservation-for-user.dto.js.map