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
exports.RestaurantTableAvailabilityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const reservation_response_dto_1 = require("./reservation-response.dto");
const occupied_time_slot_dto_1 = require("./occupied-time-slot.dto");
class RestaurantTableAvailabilityDto {
}
exports.RestaurantTableAvailabilityDto = RestaurantTableAvailabilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список активных бронирований для данного столика на выбранную дату',
        type: [reservation_response_dto_1.ReservationResponseDto],
    }),
    __metadata("design:type", Array)
], RestaurantTableAvailabilityDto.prototype, "reservations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список занятых временных слотов',
        type: [occupied_time_slot_dto_1.OccupiedTimeSlotDto],
    }),
    __metadata("design:type", Array)
], RestaurantTableAvailabilityDto.prototype, "occupiedTimeSlots", void 0);
//# sourceMappingURL=restaurant-table-availability.dto.js.map