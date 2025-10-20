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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, menuItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { user_id: userId },
            relations: ['items', 'items.menuItem', 'items.menuItem.category'],
        });
        if (!cart) {
            cart = this.cartRepository.create({
                user_id: userId,
                items: [],
            });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async getUserCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.mapCartToResponse(cart);
    }
    async addToCart(userId, addToCartDto) {
        const { item_id, quantity } = addToCartDto;
        const menuItem = await this.menuItemRepository.findOne({
            where: { item_id, is_deleted: false },
            relations: ['category'],
        });
        if (!menuItem) {
            throw new common_1.NotFoundException('Блюдо не найдено или недоступно');
        }
        const cart = await this.getOrCreateCart(userId);
        let cartItem = await this.cartItemRepository.findOne({
            where: { cart_id: cart.cart_id, item_id },
        });
        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > 10) {
                throw new common_1.BadRequestException(`Нельзя добавить в корзину более 10 единиц одного блюда. Текущее количество: ${cartItem.quantity}`);
            }
            cartItem.quantity = newQuantity;
            cartItem.updated_at = new Date();
            await this.cartItemRepository.save(cartItem);
        }
        else {
            cartItem = this.cartItemRepository.create({
                cart_id: cart.cart_id,
                item_id,
                quantity,
            });
            await this.cartItemRepository.save(cartItem);
        }
        return this.getUserCart(userId);
    }
    async updateCartItem(userId, itemId, updateCartItemDto) {
        const { quantity } = updateCartItemDto;
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.cartItemRepository.findOne({
            where: { cart_id: cart.cart_id, item_id: itemId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Товар не найден в корзине');
        }
        if (quantity === 0) {
            await this.cartItemRepository.remove(cartItem);
        }
        else {
            cartItem.quantity = quantity;
            cartItem.updated_at = new Date();
            await this.cartItemRepository.save(cartItem);
        }
        await this.checkAndCleanEmptyCart(cart.cart_id);
        return this.getUserCart(userId);
    }
    async removeFromCart(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.cartItemRepository.findOne({
            where: { cart_id: cart.cart_id, item_id: itemId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Товар не найден в корзине');
        }
        await this.cartItemRepository.remove(cartItem);
        await this.checkAndCleanEmptyCart(cart.cart_id);
        return this.getUserCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { user_id: userId },
            relations: ['items'],
        });
        if (!cart) {
            return { message: 'Корзина уже пуста' };
        }
        if (cart.items && cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }
        await this.cartRepository.remove(cart);
        return { message: 'Корзина успешно очищена' };
    }
    async checkAndCleanEmptyCart(cartId) {
        const itemsCount = await this.cartItemRepository.count({
            where: { cart_id: cartId },
        });
        if (itemsCount === 0) {
            const cart = await this.cartRepository.findOne({
                where: { cart_id: cartId },
            });
            if (cart) {
                await this.cartRepository.remove(cart);
            }
        }
    }
    mapCartToResponse(cart) {
        const items = cart.items?.map((item) => ({
            cart_item_id: item.cart_item_id,
            item_id: item.item_id,
            item_name: item.menuItem.item_name,
            item_description: item.menuItem.item_description,
            unit_price: parseFloat(item.menuItem.price.toString()),
            quantity: item.quantity,
            total_price: parseFloat(item.menuItem.price.toString()) * item.quantity,
            added_at: item.added_at,
            image_url: item.menuItem.image_url,
            category_name: item.menuItem.category?.category_name || 'Без категории',
            is_vegetarian: item.menuItem.is_vegetarian,
            is_spicy: item.menuItem.is_spicy,
        })) || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);
        return {
            cart_id: cart.cart_id,
            user_id: cart.user_id,
            items,
            total_items: totalItems,
            total_amount: parseFloat(totalAmount.toFixed(2)),
            created_at: cart.created_at,
            updated_at: cart.updated_at,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map