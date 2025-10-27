import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let menuItemRepository: Repository<MenuItem>;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockCartId = '223e4567-e89b-12d3-a456-426614174000';
  const mockItemId = 1;

  const mockMenuItem = {
    item_id: mockItemId,
    item_name: 'Test Dish',
    item_description: 'Delicious test dish',
    price: 15.99,
    category_id: 1,
    is_deleted: false,
    image_url: 'test.jpg',
    is_vegetarian: false,
    is_spicy: false,
    category: {
      category_id: 1,
      category_name: 'Test Category',
    },
  };

  const mockCartItem = {
    cart_item_id: '323e4567-e89b-12d3-a456-426614174000',
    cart_id: mockCartId,
    item_id: mockItemId,
    quantity: 2,
    added_at: new Date(),
    updated_at: new Date(),
    menuItem: mockMenuItem,
  };

  const mockCart = {
    cart_id: mockCartId,
    user_id: mockUserId,
    created_at: new Date(),
    updated_at: new Date(),
    items: [mockCartItem],
  };

  const mockCartRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCartItemRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockMenuItemRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockMenuItemRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    menuItemRepository = module.get<Repository<MenuItem>>(getRepositoryToken(MenuItem));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateCart', () => {
    it('should return existing cart if found', async () => {
      mockCartRepository.findOne.mockResolvedValue(mockCart);

      const result = await service.getOrCreateCart(mockUserId);

      expect(result).toEqual(mockCart);
      expect(mockCartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        relations: ['items', 'items.menuItem', 'items.menuItem.category'],
      });
    });

    it('should create new cart if not found', async () => {
      const newCart = { ...mockCart, items: [] };
      mockCartRepository.findOne.mockResolvedValue(null);
      mockCartRepository.create.mockReturnValue(newCart);
      mockCartRepository.save.mockResolvedValue(newCart);

      const result = await service.getOrCreateCart(mockUserId);

      expect(result).toEqual(newCart);
      expect(mockCartRepository.create).toHaveBeenCalled();
      expect(mockCartRepository.save).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const addToCartDto = { item_id: mockItemId, quantity: 1 };
      
      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockCartRepository.findOne.mockResolvedValue({ ...mockCart, items: [] });
      mockCartItemRepository.findOne.mockResolvedValue(null); // Item not in cart
      mockCartItemRepository.create.mockReturnValue(mockCartItem);
      mockCartItemRepository.save.mockResolvedValue(mockCartItem);

      const result = await service.addToCart(mockUserId, addToCartDto);

      expect(result).toBeDefined();
      expect(mockCartItemRepository.create).toHaveBeenCalled();
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });

    it('should update quantity if item already in cart', async () => {
      const addToCartDto = { item_id: mockItemId, quantity: 1 };
      const existingCartItem = { ...mockCartItem, quantity: 2 };

      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartItemRepository.findOne.mockResolvedValue(existingCartItem);
      mockCartItemRepository.save.mockResolvedValue({ ...existingCartItem, quantity: 3 });

      const result = await service.addToCart(mockUserId, addToCartDto);

      expect(result).toBeDefined();
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if menu item not found', async () => {
      const addToCartDto = { item_id: 999, quantity: 1 };
      mockMenuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.addToCart(mockUserId, addToCartDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if quantity exceeds maximum', async () => {
      const addToCartDto = { item_id: mockItemId, quantity: 5 };
      const existingCartItem = { ...mockCartItem, quantity: 9 };

      mockMenuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartItemRepository.findOne.mockResolvedValue(existingCartItem);

      await expect(service.addToCart(mockUserId, addToCartDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartItemRepository.findOne.mockResolvedValue(mockCartItem);
      mockCartItemRepository.remove.mockResolvedValue(mockCartItem);
      mockCartItemRepository.count.mockResolvedValue(0);
      mockCartRepository.remove.mockResolvedValue(mockCart);

      const result = await service.removeFromCart(mockUserId, mockItemId);

      expect(result).toBeDefined();
      expect(mockCartItemRepository.remove).toHaveBeenCalledWith(mockCartItem);
    });

    it('should throw NotFoundException if item not in cart', async () => {
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartItemRepository.findOne.mockResolvedValue(null);

      await expect(service.removeFromCart(mockUserId, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartItemRepository.remove.mockResolvedValue([mockCartItem]);
      mockCartRepository.remove.mockResolvedValue(mockCart);

      const result = await service.clearCart(mockUserId);

      expect(result).toHaveProperty('message');
      expect(mockCartItemRepository.remove).toHaveBeenCalledWith(mockCart.items);
      expect(mockCartRepository.remove).toHaveBeenCalledWith(mockCart);
    });

    it('should return message if cart is already empty', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);

      const result = await service.clearCart(mockUserId);

      expect(result.message).toContain('пуста');
    });
  });

  describe('getUserCart', () => {
    it('should return cart with calculated totals', async () => {
      mockCartRepository.findOne.mockResolvedValue(mockCart);

      const result = await service.getUserCart(mockUserId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('cart_id');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total_items');
      expect(result).toHaveProperty('total_amount');
      expect(result.total_items).toBeGreaterThan(0);
    });
  });
});
