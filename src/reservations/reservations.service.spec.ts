import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  TableReservation,
  ReservationStatus,
} from '../entities/table-reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<TableReservation>;
  let tableRepository: Repository<Table>;
  let restaurantRepository: Repository<Restaurant>;
  let userRepository: Repository<User>;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockReservationId = '223e4567-e89b-12d3-a456-426614174000';

  const mockUser = {
    user_id: mockUserId,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: 'Test Restaurant',
    is_active: true,
    working_hours: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '10:00-22:00',
    },
  };

  const mockTable = {
    table_id: 1,
    restaurant_id: 1,
    table_number: 5,
    seats_count: 4,
    is_active: true,
  };

  const mockReservation = {
    reservation_id: mockReservationId,
    user_id: mockUserId,
    restaurant_id: 1,
    table_id: 1,
    reservation_date: new Date('2025-12-15'),
    reservation_time: '18:00',
    duration_hours: 2,
    guests_count: 4,
    contact_phone: '+1234567890',
    reservation_status: ReservationStatus.UNCONFIRMED,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockReservationRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTableRepository = {
    findOne: jest.fn(),
  };

  const mockRestaurantRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(TableReservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Table),
          useValue: mockTableRepository,
        },
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRestaurantRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<TableReservation>>(
      getRepositoryToken(TableReservation),
    );
    tableRepository = module.get<Repository<Table>>(getRepositoryToken(Table));
    restaurantRepository = module.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    const createDto = {
      restaurant_id: 1,
      table_id: 1,
      reservation_date: '2025-12-15',
      reservation_time: '18:00',
      duration_hours: 2,
      guests_count: 4,
      contact_phone: '+1234567890',
    };

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.createReservation(mockUserId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRestaurantRepository.findOne.mockResolvedValue(null);

      await expect(service.createReservation(mockUserId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if table not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRestaurantRepository.findOne.mockResolvedValue(mockRestaurant);
      mockTableRepository.findOne.mockResolvedValue(null);

      await expect(service.createReservation(mockUserId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if guests exceed table capacity', async () => {
      const dtoWithTooManyGuests = { ...createDto, guests_count: 10 };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRestaurantRepository.findOne.mockResolvedValue(mockRestaurant);
      mockTableRepository.findOne.mockResolvedValue(mockTable);

      await expect(
        service.createReservation(mockUserId, dtoWithTooManyGuests),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations', async () => {
      const reservationWithRelations = {
        ...mockReservation,
        restaurant: mockRestaurant,
        table: mockTable,
      };

      mockReservationRepository.find.mockResolvedValue([reservationWithRelations]);

      const result = await service.getUserReservations(mockUserId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockReservationRepository.find).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        relations: ['user', 'restaurant', 'table'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('confirmReservation', () => {
    it('should update reservation status to CONFIRMED', async () => {
      const unconfirmedReservation = {
        ...mockReservation,
        reservation_status: ReservationStatus.UNCONFIRMED,
        restaurant: mockRestaurant,
        table: mockTable,
      };

      mockReservationRepository.findOne.mockResolvedValue(unconfirmedReservation);
      mockReservationRepository.save.mockResolvedValue({
        ...unconfirmedReservation,
        reservation_status: ReservationStatus.CONFIRMED,
      });

      const result = await service.confirmReservation(mockUserId, mockReservationId);

      expect(result).toBeDefined();
      expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.confirmReservation(mockUserId, 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const activeReservation = {
        ...mockReservation,
        reservation_status: ReservationStatus.UNCONFIRMED, // Changed to UNCONFIRMED
        restaurant: mockRestaurant,
        table: mockTable,
      };

      mockReservationRepository.findOne.mockResolvedValue(activeReservation);
      mockReservationRepository.save.mockResolvedValue({
        ...activeReservation,
        reservation_status: ReservationStatus.CANCELLED,
      });

      const result = await service.cancelReservation(mockUserId, mockReservationId);

      expect(result).toBeDefined();
      expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.cancelReservation(mockUserId, 'nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
