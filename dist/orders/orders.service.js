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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const user_entity_1 = require("../entities/user.entity");
const user_address_entity_1 = require("../entities/user-address.entity");
const table_reservation_entity_1 = require("../entities/table-reservation.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, cartRepository, cartItemRepository, userRepository, userAddressRepository, tableReservationRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
        this.tableReservationRepository = tableReservationRepository;
        this.dataSource = dataSource;
    }
    async createOrder(userId, createOrderDto) {
        const { order_type, delivery_country, delivery_city, delivery_street_address, delivery_phone, reservation_id, should_update_user_address = false, } = createOrderDto;
        try {
            const result = await this.dataSource.query(`SELECT create_order_from_cart_transactional($1, $2, $3, $4, $5, $6, $7, $8) as result`, [
                userId,
                order_type,
                delivery_country || null,
                delivery_city || null,
                delivery_street_address || null,
                delivery_phone || null,
                reservation_id || null,
                should_update_user_address,
            ]);
            const functionResult = result[0]?.result;
            if (!functionResult || functionResult.status !== 'ok') {
                throw new common_1.BadRequestException(functionResult?.message || 'Ошибка при создании заказа');
            }
            const order = await this.getOrderById(functionResult.order_id);
            return order;
        }
        catch (error) {
            if (error.message.includes('User cart not found')) {
                throw new common_1.NotFoundException('Корзина пользователя не найдена');
            }
            if (error.message.includes('Cart is empty')) {
                throw new common_1.BadRequestException('Корзина пуста');
            }
            if (error.message.includes('Reservation not found')) {
                throw new common_1.NotFoundException('Бронирование не найдено или не принадлежит пользователю');
            }
            if (error.message.includes('reservation status is')) {
                throw new common_1.BadRequestException('Нельзя создать заказ в ресторане: бронирование не в статусе "начато"');
            }
            if (error.message.includes('No restaurant found')) {
                throw new common_1.BadRequestException('В указанном городе нет ресторанов. Доставка недоступна');
            }
            if (error.message.includes('All delivery fields')) {
                throw new common_1.BadRequestException('Для заказа с доставкой необходимо указать все адресные данные');
            }
            if (error.message.includes('Delivery fields must not be provided')) {
                throw new common_1.BadRequestException('Для заказа в ресторане адресные данные указывать не нужно');
            }
            if (error.message.includes('Reservation ID is required')) {
                throw new common_1.BadRequestException('Для заказа в ресторане необходимо указать ID бронирования');
            }
            if (error.message.includes('Reservation ID must not be provided')) {
                throw new common_1.BadRequestException('Для заказа с доставкой ID бронирования указывать не нужно');
            }
            throw new common_1.BadRequestException(error.message || 'Ошибка при создании заказа');
        }
    }
    async getOrderById(orderId) {
        const order = await this.orderRepository.findOne({
            where: { order_id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Заказ не найден');
        }
        const orderItems = await this.dataSource.query(`
      SELECT 
        oi.order_item_id,
        oi.item_id,
        mi.item_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price
      FROM order_items oi
      JOIN menu_items mi ON oi.item_id = mi.item_id
      WHERE oi.order_id = $1
      ORDER BY oi.order_item_id
      `, [orderId]);
        return this.mapToResponseDto(order, orderItems);
    }
    async getUserOrders(userId) {
        const orders = await this.orderRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const orderItems = await this.dataSource.query(`
          SELECT 
            oi.order_item_id,
            oi.item_id,
            mi.item_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price
          FROM order_items oi
          JOIN menu_items mi ON oi.item_id = mi.item_id
          WHERE oi.order_id = $1
          ORDER BY oi.order_item_id
          `, [order.order_id]);
            return this.mapToResponseDto(order, orderItems);
        }));
        return ordersWithItems;
    }
    async getAllOrders() {
        const orders = await this.orderRepository.find({
            order: { created_at: 'DESC' },
        });
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const orderItems = await this.dataSource.query(`
          SELECT 
            oi.order_item_id,
            oi.item_id,
            mi.item_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price
          FROM order_items oi
          JOIN menu_items mi ON oi.item_id = mi.item_id
          WHERE oi.order_id = $1
          ORDER BY oi.order_item_id
          `, [order.order_id]);
            return this.mapToResponseDto(order, orderItems);
        }));
        return ordersWithItems;
    }
    async getUserAddress(userId) {
        const userAddress = await this.userAddressRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
        if (!userAddress) {
            return null;
        }
        return {
            country: userAddress.country,
            city: userAddress.city,
            street_address: userAddress.street_address,
        };
    }
    mapToResponseDto(order, orderItems = []) {
        return {
            order_id: order.order_id,
            user_id: order.user_id,
            order_type: order.order_type,
            delivery_country: order.delivery_country,
            delivery_city: order.delivery_city,
            delivery_street_address: order.delivery_street_address,
            delivery_phone: order.delivery_phone,
            reservation_id: order.reservation_id,
            subtotal: parseFloat(order.subtotal.toString()),
            delivery_fee: parseFloat(order.delivery_fee.toString()),
            total_amount: parseFloat(order.total_amount.toString()),
            created_at: order.created_at,
            updated_at: order.updated_at,
            order_items: orderItems.map((item) => ({
                order_item_id: item.order_item_id,
                item_id: item.item_id,
                item_name: item.item_name,
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price),
                total_price: parseFloat(item.total_price),
            })),
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(3, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(user_address_entity_1.UserAddress)),
    __param(6, (0, typeorm_1.InjectRepository)(table_reservation_entity_1.TableReservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map