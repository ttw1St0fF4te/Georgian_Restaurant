import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto, CartItemResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  /**
   * Получить или создать корзину для пользователя
   */
  async getOrCreateCart(userId: string): Promise<Cart> {
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

  /**
   * Получить корзину пользователя
   */
  async getUserCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);
    return this.mapCartToResponse(cart);
  }

  /**
   * Добавить товар в корзину
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const { item_id, quantity } = addToCartDto;

    // Проверяем существование блюда
    const menuItem = await this.menuItemRepository.findOne({
      where: { item_id, is_deleted: false },
      relations: ['category'],
    });

    if (!menuItem) {
      throw new NotFoundException('Блюдо не найдено или недоступно');
    }

    // Получаем или создаем корзину
    const cart = await this.getOrCreateCart(userId);

    // Проверяем есть ли уже этот товар в корзине
    let cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.cart_id, item_id },
    });

    if (cartItem) {
      // Проверяем ограничение на максимальное количество
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > 10) {
        throw new BadRequestException(
          `Нельзя добавить в корзину более 10 единиц одного блюда. Текущее количество: ${cartItem.quantity}`,
        );
      }

      cartItem.quantity = newQuantity;
      cartItem.updated_at = new Date();
      await this.cartItemRepository.save(cartItem);
    } else {
      // Добавляем новый товар в корзину
      cartItem = this.cartItemRepository.create({
        cart_id: cart.cart_id,
        item_id,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    // Возвращаем обновленную корзину
    return this.getUserCart(userId);
  }

  /**
   * Обновить количество товара в корзине
   */
  async updateCartItem(
    userId: string,
    itemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const { quantity } = updateCartItemDto;
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.cart_id, item_id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    if (quantity === 0) {
      // Удаляем товар из корзины
      await this.cartItemRepository.remove(cartItem);
    } else {
      // Обновляем количество
      cartItem.quantity = quantity;
      cartItem.updated_at = new Date();
      await this.cartItemRepository.save(cartItem);
    }

    // Проверяем, не стала ли корзина пустой
    await this.checkAndCleanEmptyCart(cart.cart_id);

    return this.getUserCart(userId);
  }

  /**
   * Удалить товар из корзины
   */
  async removeFromCart(userId: string, itemId: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.cart_id, item_id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    await this.cartItemRepository.remove(cartItem);

    // Проверяем, не стала ли корзина пустой
    await this.checkAndCleanEmptyCart(cart.cart_id);

    return this.getUserCart(userId);
  }

  /**
   * Очистить корзину полностью
   */
  async clearCart(userId: string): Promise<{ message: string }> {
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

    // Удаляем саму корзину, так как она теперь пустая
    await this.cartRepository.remove(cart);

    return { message: 'Корзина успешно очищена' };
  }

  /**
   * Проверить и удалить пустую корзину
   */
  private async checkAndCleanEmptyCart(cartId: string): Promise<void> {
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

  /**
   * Преобразовать корзину в DTO ответа
   */
  private mapCartToResponse(cart: Cart): CartResponseDto {
    const items: CartItemResponseDto[] = cart.items?.map((item) => ({
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
}