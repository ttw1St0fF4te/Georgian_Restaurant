import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from '../entities/order.entity';
import { TableReservation } from '../entities/table-reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(TableReservation)
    private readonly reservationRepository: Repository<TableReservation>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Возвращает продажи по дням за период. Если передан restaurantId - фильтрует по ресторану (через reservation -> restaurant).
   */
  async getSalesByDay(
    restaurantId: number | null,
    from: string,
    to: string,
  ): Promise<Array<{ day: string; total: number }>> {
    const qb = this.orderRepository.createQueryBuilder('o')
      .select("date_trunc('day', o.created_at)::date", 'day')
      .addSelect('SUM(o.total_amount)::float', 'total')
      .where('o.created_at BETWEEN :from AND :to', { from, to })
      .groupBy('day')
      .orderBy('day', 'ASC');

    // join reservation -> table_reservations for restaurant filter
    if (restaurantId) {
      qb.leftJoin('o.reservation', 'r')
        .andWhere('r.restaurant_id = :rid', { rid: restaurantId });
    }

    const raw = await qb.getRawMany();

    return raw.map((r) => ({ day: String(r.day), total: parseFloat(r.total) || 0 }));
  }

  /**
   * Возвращает количество бронирований по столикам за период (occupancy simple metric).
   */
  async getOccupancyByTable(
    restaurantId: number | null,
    from: string,
    to: string,
  ): Promise<Array<{ table_id: number; table_number?: number; reservations_count: number }>> {
    const qb = this.reservationRepository.createQueryBuilder('tr')
      .select('tr.table_id', 'table_id')
      .addSelect('COUNT(*)', 'reservations_count')
      .where('tr.reservation_date BETWEEN :from AND :to', { from, to })
      .groupBy('tr.table_id')
      .orderBy('reservations_count', 'DESC');

    if (restaurantId) qb.andWhere('tr.restaurant_id = :rid', { rid: restaurantId });

    const raw = await qb.getRawMany();

    // enrich with table_number where possible
    const tableIds = raw.map((r) => r.table_id);
    const tables = tableIds.length > 0 
      ? await this.tableRepository.find({ where: { table_id: In(tableIds) } })
      : [];
    const tableMap = new Map<number, Table>();
    tables.forEach((t) => tableMap.set((t as any).table_id, t));

    return raw.map((r) => ({
      table_id: Number(r.table_id),
      table_number: tableMap.get(Number(r.table_id))?.table_number,
      reservations_count: Number(r.reservations_count),
    }));
  }

  /**
   * Возвращает количество посещений пользователей по дням (по полю last_login).
   */
  async getUserVisits(from: string, to: string): Promise<Array<{ day: string; total_visits: number }>> {
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

  /**
   * Экспорт продаж в CSV (простая Excel-совместимая выгрузка)
   */
  async exportSalesCsv(restaurantId: number | null, from: string, to: string): Promise<{ filename: string; csv: string }> {
    const rows = await this.getSalesByDay(restaurantId, from, to);
    const header = 'day,total\n';
    const lines = rows.map((r) => `${r.day},${r.total.toFixed(2)}`).join('\n');
    const csv = header + lines + '\n';
    const filename = `sales_${from}_to_${to}.csv`;
    return { filename, csv };
  }

  /**
   * Экспорт занятости столиков в CSV
   */
  async exportOccupancyCsv(restaurantId: number | null, from: string, to: string): Promise<{ filename: string; csv: string }> {
    const rows = await this.getOccupancyByTable(restaurantId, from, to);
    const header = 'table_id,table_number,reservations_count\n';
    const lines = rows.map((r) => `${r.table_id},${r.table_number || 'N/A'},${r.reservations_count}`).join('\n');
    const csv = header + lines + '\n';
    const filename = `occupancy_${from}_to_${to}.csv`;
    return { filename, csv };
  }

  /**
   * Экспорт активности пользователей в CSV
   */
  async exportUserVisitsCsv(from: string, to: string): Promise<{ filename: string; csv: string }> {
    const rows = await this.getUserVisits(from, to);
    const header = 'day,total_visits\n';
    const lines = rows.map((r) => `${r.day},${r.total_visits}`).join('\n');
    const csv = header + lines + '\n';
    const filename = `user_visits_${from}_to_${to}.csv`;
    return { filename, csv };
  }

  /**
   * Экспорт всех данных в один CSV файл
   */
  async exportAllDataCsv(restaurantId: number | null, from: string, to: string): Promise<{ filename: string; csv: string }> {
    const [salesData, occupancyData, visitsData] = await Promise.all([
      this.getSalesByDay(restaurantId, from, to),
      this.getOccupancyByTable(restaurantId, from, to),
      this.getUserVisits(from, to),
    ]);

    let csv = '';
    
    // Секция продаж
    csv += 'ПРОДАЖИ ПО ДНЯМ\n';
    csv += 'day,total_sales\n';
    csv += salesData.map((r) => `${r.day},${r.total.toFixed(2)}`).join('\n');
    csv += '\n\n';

    // Секция занятости столиков
    csv += 'ПОПУЛЯРНОСТЬ СТОЛИКОВ\n';
    csv += 'table_id,table_number,reservations_count\n';
    csv += occupancyData.map((r) => `${r.table_id},${r.table_number || 'N/A'},${r.reservations_count}`).join('\n');
    csv += '\n\n';

    // Секция активности пользователей
    csv += 'АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ\n';
    csv += 'day,total_visits\n';
    csv += visitsData.map((r) => `${r.day},${r.total_visits}`).join('\n');
    csv += '\n';

    const restaurantSuffix = restaurantId ? `_restaurant_${restaurantId}` : '_all_restaurants';
    const filename = `full_report_${from}_to_${to}${restaurantSuffix}.csv`;
    return { filename, csv };
  }
}
