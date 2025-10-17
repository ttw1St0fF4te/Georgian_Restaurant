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
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
let Restaurant = class Restaurant {
};
exports.Restaurant = Restaurant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Restaurant.prototype, "restaurant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Restaurant.prototype, "restaurant_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "restaurant_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'Грузия' }),
    __metadata("design:type", String)
], Restaurant.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'Тбилиси' }),
    __metadata("design:type", String)
], Restaurant.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Restaurant.prototype, "street_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Restaurant.prototype, "working_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Restaurant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Restaurant.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Table', 'restaurant'),
    __metadata("design:type", Array)
], Restaurant.prototype, "tables", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TableReservation', 'restaurant'),
    __metadata("design:type", Array)
], Restaurant.prototype, "reservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('RestaurantReview', 'restaurant'),
    __metadata("design:type", Array)
], Restaurant.prototype, "reviews", void 0);
exports.Restaurant = Restaurant = __decorate([
    (0, typeorm_1.Entity)('restaurants')
], Restaurant);
//# sourceMappingURL=restaurant.entity.js.map