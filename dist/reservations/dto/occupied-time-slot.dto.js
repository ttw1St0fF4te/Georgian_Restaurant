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
exports.OccupiedTimeSlotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OccupiedTimeSlotDto {
}
exports.OccupiedTimeSlotDto = OccupiedTimeSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время начала занятого слота',
        example: '18:00',
    }),
    __metadata("design:type", String)
], OccupiedTimeSlotDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время окончания занятого слота',
        example: '20:00',
    }),
    __metadata("design:type", String)
], OccupiedTimeSlotDto.prototype, "end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID бронирования, занимающего этот слот',
        example: 'b42bb960-ff62-4ca6-8e9d-c47ce9470ed6',
    }),
    __metadata("design:type", String)
], OccupiedTimeSlotDto.prototype, "reservation_id", void 0);
//# sourceMappingURL=occupied-time-slot.dto.js.map