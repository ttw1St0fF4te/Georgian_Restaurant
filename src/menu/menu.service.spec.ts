import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MenuSortField, SortOrder } from './dto/menu.dto';

describe('MenuService', () => {
  let service: MenuService;
  let menuItemRepository: Repository<MenuItem>;
  let menuCategoryRepository: Repository<MenuCategory>;

  const mockCategory = {
    category_id: 1,
    category_name: 'Main Courses',
    description: 'Main course dishes',
    display_order: 1,
    is_active: true,
  };

  const mockMenuItem = {
    item_id: 1,
    item_name: 'Khachapuri',
    item_description: 'Georgian cheese bread',
    price: 12.99,
    category_id: 1,
    cooking_time_minutes: 30,
    calories: 450,
    is_vegetarian: true,
    is_spicy: false,
    is_deleted: false,
    image_url: 'khachapuri.jpg',
    created_at: new Date(),
    updated_at: new Date(),
    category: mockCategory,
  };

  const mockQueryBuilder: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getCount: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const mockMenuItemRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockMenuCategoryRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockMenuItemRepository,
        },
        {
          provide: getRepositoryToken(MenuCategory),
          useValue: mockMenuCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuItemRepository = module.get<Repository<MenuItem>>(getRepositoryToken(MenuItem));
    menuCategoryRepository = module.get<Repository<MenuCategory>>(
      getRepositoryToken(MenuCategory),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated menu items', async () => {
      const filterDto = {
        page: 1,
        limit: 10,
        sort_by: MenuSortField.NAME,
        sort_order: SortOrder.ASC,
      };

      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMenuItem]);

      const result = await service.findAll(filterDto);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pages).toBe(1);
    });

    it('should apply search filter', async () => {
      const filterDto = {
        search: 'Khachapuri',
        page: 1,
        limit: 10,
        sort_by: MenuSortField.NAME,
        sort_order: SortOrder.ASC,
      };

      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMenuItem]);

      await service.findAll(filterDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply category filter', async () => {
      const filterDto = {
        category_id: 1,
        page: 1,
        limit: 10,
        sort_by: MenuSortField.NAME,
        sort_order: SortOrder.ASC,
      };

      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMenuItem]);

      await service.findAll(filterDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should apply price filters', async () => {
      const filterDto = {
        min_price: 10,
        max_price: 20,
        page: 1,
        limit: 10,
        sort_by: MenuSortField.PRICE,
        sort_order: SortOrder.ASC,
      };

      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMenuItem]);

      await service.findAll(filterDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMenuItem);
      expect(mockMenuItemRepository.findOne).toHaveBeenCalledWith({
        where: { item_id: 1, is_deleted: false },
        relations: ['category'],
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should not return deleted items', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new menu item', async () => {
      const createDto = {
        item_name: 'New Dish',
        item_description: 'Delicious new dish',
        price: 15.99,
        category_id: 1,
        cooking_time_minutes: 25,
        is_vegetarian: true,
        is_spicy: false,
      };

      mockMenuCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockMenuItemRepository.create.mockReturnValue({ ...createDto, item_id: 2 });
      mockMenuItemRepository.save.mockResolvedValue({ ...createDto, item_id: 2 });

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(mockMenuItemRepository.create).toHaveBeenCalled();
      expect(mockMenuItemRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if category not found', async () => {
      const createDto = {
        item_name: 'New Dish',
        item_description: 'Delicious new dish',
        price: 15.99,
        category_id: 999,
      };

      mockMenuCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing menu item', async () => {
      const updateDto = {
        item_name: 'Updated Khachapuri',
        price: 13.99,
      };

      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockMenuItemRepository.save.mockResolvedValue({ ...mockMenuItem, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result).toBeDefined();
      expect(mockMenuItemRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { price: 15.99 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate category if category_id is updated', async () => {
      const updateDto = { category_id: 2 };

      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockMenuCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a menu item', async () => {
      const deletedItem = { ...mockMenuItem, is_deleted: true };
      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockMenuItemRepository.save.mockResolvedValue(deletedItem);

      const result = await service.softDelete(1);

      expect(result.is_deleted).toBe(true);
      expect(mockMenuItemRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted menu item', async () => {
      const deletedItem = { ...mockMenuItem, is_deleted: true };
      const restoredItem = { ...mockMenuItem, is_deleted: false };

      mockMenuItemRepository.findOne.mockResolvedValue(deletedItem);
      mockMenuItemRepository.save.mockResolvedValue(restoredItem);

      const result = await service.restore(1);

      expect(result.is_deleted).toBe(false);
      expect(mockMenuItemRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByCategory', () => {
    it('should return menu items by category', async () => {
      const filterDto = {
        page: 1,
        limit: 10,
        sort_by: MenuSortField.NAME,
        sort_order: SortOrder.ASC,
      };

      mockMenuCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMenuItem]);

      const result = await service.findByCategory(1, filterDto);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(mockMenuCategoryRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockMenuCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByCategory(999, {
          page: 1,
          limit: 10,
          sort_by: MenuSortField.NAME,
          sort_order: SortOrder.ASC,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
