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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const menu_item_entity_1 = require("./menu-item.entity");
let CartItem = class CartItem {
};
exports.CartItem = CartItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CartItem.prototype, "cart_item_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], CartItem.prototype, "cart_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], CartItem.prototype, "item_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        transformer: {
            to: (value) => value,
            from: (value) => parseInt(value, 10),
        }
    }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], CartItem.prototype, "added_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], CartItem.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Cart', 'items', {
        onDelete: 'CASCADE',
        eager: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cart_id' }),
    __metadata("design:type", Object)
], CartItem.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], CartItem.prototype, "menuItem", void 0);
exports.CartItem = CartItem = __decorate([
    (0, typeorm_1.Entity)('cart_items'),
    (0, typeorm_1.Unique)(['cart_id', 'item_id'])
], CartItem);
//# sourceMappingURL=cart-item.entity.js.map