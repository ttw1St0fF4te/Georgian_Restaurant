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
exports.ReservationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const table_reservation_entity_1 = require("../../entities/table-reservation.entity");
class ReservationResponseDto {
}
exports.ReservationResponseDto = ReservationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID бронирования',
        example: 'b42bb960-ff62-4ca6-8e9d-c47ce9470ed6',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "reservation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя',
        example: 'a32cc850-ee52-3ba6-7d8c-b47ce9470ed5',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID ресторана',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название ресторана',
        example: 'Тбилисо',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "restaurant_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID столика',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "table_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Номер столика',
        example: 5,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "table_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество мест за столиком',
        example: 4,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "seats_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата бронирования',
        example: '2025-10-25',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "reservation_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время начала бронирования',
        example: '18:00:00',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "reservation_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Продолжительность в часах',
        example: 2,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "duration_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество гостей',
        example: 4,
    }),
    __metadata("design:type", Number)
], ReservationResponseDto.prototype, "guests_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус бронирования',
        enum: table_reservation_entity_1.ReservationStatus,
        example: table_reservation_entity_1.ReservationStatus.UNCONFIRMED,
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "reservation_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Контактный телефон',
        example: '+995555123456',
    }),
    __metadata("design:type", String)
], ReservationResponseDto.prototype, "contact_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания бронирования',
        example: '2025-10-22T15:30:00.000Z',
    }),
    __metadata("design:type", Date)
], ReservationResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2025-10-22T15:30:00.000Z',
    }),
    __metadata("design:type", Date)
], ReservationResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата подтверждения бронирования (если подтверждена)',
        example: '2025-10-22T16:00:00.000Z',
        required: false,
    }),
    __metadata("design:type", Date)
], ReservationResponseDto.prototype, "confirmed_at", void 0);
//# sourceMappingURL=reservation-response.dto.js.map