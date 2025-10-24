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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const table_reservation_entity_1 = require("../entities/table-reservation.entity");
const table_entity_1 = require("../entities/table.entity");
const restaurant_entity_1 = require("../entities/restaurant.entity");
const user_entity_1 = require("../entities/user.entity");
let ReportsService = class ReportsService {
    constructor(orderRepository, reservationRepository, tableRepository, restaurantRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }
    async getSalesByDay(restaurantId, from, to) {
        const qb = this.orderRepository.createQueryBuilder('o')
            .select("date_trunc('day', o.created_at)::date", 'day')
            .addSelect('SUM(o.total_amount)::float', 'total')
            .where('o.created_at BETWEEN :from AND :to', { from, to })
            .groupBy('day')
            .orderBy('day', 'ASC');
        if (restaurantId) {
            qb.leftJoin('o.reservation', 'r')
                .andWhere('r.restaurant_id = :rid', { rid: restaurantId });
        }
        const raw = await qb.getRawMany();
        return raw.map((r) => ({ day: String(r.day), total: parseFloat(r.total) || 0 }));
    }
    async getOccupancyByTable(restaurantId, from, to) {
        const qb = this.reservationRepository.createQueryBuilder('tr')
            .select('tr.table_id', 'table_id')
            .addSelect('COUNT(*)', 'reservations_count')
            .where('tr.reservation_date BETWEEN :from AND :to', { from, to })
            .groupBy('tr.table_id')
            .orderBy('reservations_count', 'DESC');
        if (restaurantId)
            qb.andWhere('tr.restaurant_id = :rid', { rid: restaurantId });
        const raw = await qb.getRawMany();
        const tableIds = raw.map((r) => r.table_id);
        const tables = tableIds.length > 0
            ? await this.tableRepository.find({ where: { table_id: (0, typeorm_2.In)(tableIds) } })
            : [];
        const tableMap = new Map();
        tables.forEach((t) => tableMap.set(t.table_id, t));
        return raw.map((r) => ({
            table_id: Number(r.table_id),
            table_number: tableMap.get(Number(r.table_id))?.table_number,
            reservations_count: Number(r.reservations_count),
        }));
    }
    async getUserVisits(from, to) {
        const qb = this.userRepository.createQueryBuilder('u')
            .select("date_trunc('day', u.last_login)::date", 'day')
            .addSelect('COUNT(u.user_id)', 'total_visits')
            .where('u.last_login BETWEEN :from AND :to', { from, to })
            .andWhere('u.last_login IS NOT NULL')
            .groupBy('day')
            .orderBy('day', 'ASC');
        const raw = await qb.getRawMany();
        return raw.map((r) => ({ day: String(r.day), total_visits: Number(r.total_visits) }));
    }
    async exportSalesCsv(restaurantId, from, to) {
        const rows = await this.getSalesByDay(restaurantId, from, to);
        const header = 'day,total\n';
        const lines = rows.map((r) => `${r.day},${r.total.toFixed(2)}`).join('\n');
        const csv = header + lines + '\n';
        const filename = `sales_${from}_to_${to}.csv`;
        return { filename, csv };
    }
    async exportOccupancyCsv(restaurantId, from, to) {
        const rows = await this.getOccupancyByTable(restaurantId, from, to);
        const header = 'table_id,table_number,reservations_count\n';
        const lines = rows.map((r) => `${r.table_id},${r.table_number || 'N/A'},${r.reservations_count}`).join('\n');
        const csv = header + lines + '\n';
        const filename = `occupancy_${from}_to_${to}.csv`;
        return { filename, csv };
    }
    async exportUserVisitsCsv(from, to) {
        const rows = await this.getUserVisits(from, to);
        const header = 'day,total_visits\n';
        const lines = rows.map((r) => `${r.day},${r.total_visits}`).join('\n');
        const csv = header + lines + '\n';
        const filename = `user_visits_${from}_to_${to}.csv`;
        return { filename, csv };
    }
    async exportAllDataCsv(restaurantId, from, to) {
        const [salesData, occupancyData, visitsData] = await Promise.all([
            this.getSalesByDay(restaurantId, from, to),
            this.getOccupancyByTable(restaurantId, from, to),
            this.getUserVisits(from, to),
        ]);
        let csv = '';
        csv += 'ПРОДАЖИ ПО ДНЯМ\n';
        csv += 'day,total_sales\n';
        csv += salesData.map((r) => `${r.day},${r.total.toFixed(2)}`).join('\n');
        csv += '\n\n';
        csv += 'ПОПУЛЯРНОСТЬ СТОЛИКОВ\n';
        csv += 'table_id,table_number,reservations_count\n';
        csv += occupancyData.map((r) => `${r.table_id},${r.table_number || 'N/A'},${r.reservations_count}`).join('\n');
        csv += '\n\n';
        csv += 'АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ\n';
        csv += 'day,total_visits\n';
        csv += visitsData.map((r) => `${r.day},${r.total_visits}`).join('\n');
        csv += '\n';
        const restaurantSuffix = restaurantId ? `_restaurant_${restaurantId}` : '_all_restaurants';
        const filename = `full_report_${from}_to_${to}${restaurantSuffix}.csv`;
        return { filename, csv };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(table_reservation_entity_1.TableReservation)),
    __param(2, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(3, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map