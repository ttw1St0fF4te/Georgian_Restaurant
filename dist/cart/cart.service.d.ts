import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class CartService {
    private readonly cartRepository;
    private readonly cartItemRepository;
    private readonly menuItemRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, menuItemRepository: Repository<MenuItem>);
    getOrCreateCart(userId: string): Promise<Cart>;
    getUserCart(userId: string): Promise<CartResponseDto>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto>;
    updateCartItem(userId: string, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeFromCart(userId: string, itemId: number): Promise<CartResponseDto>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    private checkAndCleanEmptyCart;
    private mapCartToResponse;
}
