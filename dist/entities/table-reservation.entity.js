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
exports.TableReservation = exports.ReservationStatus = void 0;
const typeorm_1 = require("typeorm");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["UNCONFIRMED"] = "unconfirmed";
    ReservationStatus["CONFIRMED"] = "confirmed";
    ReservationStatus["COMPLETED"] = "completed";
    ReservationStatus["CANCELLED"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
let TableReservation = class TableReservation {
};
exports.TableReservation = TableReservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TableReservation.prototype, "reservation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TableReservation.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TableReservation.prototype, "restaurant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TableReservation.prototype, "table_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], TableReservation.prototype, "reservation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], TableReservation.prototype, "reservation_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 2 }),
    __metadata("design:type", Number)
], TableReservation.prototype, "duration_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TableReservation.prototype, "guests_count", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.UNCONFIRMED
    }),
    __metadata("design:type", String)
], TableReservation.prototype, "reservation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], TableReservation.prototype, "contact_phone", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TableReservation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TableReservation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TableReservation.prototype, "confirmed_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'reservations', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], TableReservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Restaurant', 'reservations', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'restaurant_id' }),
    __metadata("design:type", Object)
], TableReservation.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Table', 'reservations', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'table_id' }),
    __metadata("design:type", Object)
], TableReservation.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Order', 'reservation'),
    __metadata("design:type", Array)
], TableReservation.prototype, "orders", void 0);
exports.TableReservation = TableReservation = __decorate([
    (0, typeorm_1.Entity)('table_reservations')
], TableReservation);
//# sourceMappingURL=table-reservation.entity.js.map