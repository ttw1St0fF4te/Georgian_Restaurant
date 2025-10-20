import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<CartResponseDto>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto>;
    updateCartItem(userId: string, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeFromCart(userId: string, itemId: number): Promise<CartResponseDto>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
