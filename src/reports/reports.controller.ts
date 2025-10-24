import {
  Controller,
  Get,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager', 'admin')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Продажи по дням' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Продажи по дням' })
  async getSalesByDay(
    @Query('restaurantId') restaurantId: string | undefined,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const rid = restaurantId ? parseInt(restaurantId, 10) : null;
    return this.reportsService.getSalesByDay(rid, from, to);
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Занятость столиков (количество бронирований по столикам)' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async getOccupancy(
    @Query('restaurantId') restaurantId: string | undefined,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const rid = restaurantId ? parseInt(restaurantId, 10) : null;
    return this.reportsService.getOccupancyByTable(rid, from, to);
  }

  @Get('user-visits')
  @ApiOperation({ summary: 'Посещения пользователей (unique users по дням по полю last_login)' })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async getUserVisits(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getUserVisits(from, to);
  }

  @Get('export/sales')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Экспорт продаж в CSV' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async exportSalesCsv(
    @Query('restaurantId') restaurantId: number | undefined,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const rid = restaurantId ?? null;
    const { filename, csv } = await this.reportsService.exportSalesCsv(rid, from, to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('export/occupancy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Экспорт занятости столиков в CSV' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async exportOccupancyCsv(
    @Query('restaurantId') restaurantId: number | undefined,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const rid = restaurantId ?? null;
    const { filename, csv } = await this.reportsService.exportOccupancyCsv(rid, from, to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('export/user-visits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Экспорт активности пользователей в CSV' })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async exportUserVisitsCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const { filename, csv } = await this.reportsService.exportUserVisitsCsv(from, to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('export/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Экспорт всех данных в один CSV файл' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async exportAllDataCsv(
    @Query('restaurantId') restaurantId: number | undefined,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const rid = restaurantId ?? null;
    const { filename, csv } = await this.reportsService.exportAllDataCsv(rid, from, to);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
