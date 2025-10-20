import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
@Roles('user') // Корзина доступна только пользователям с ролью 'user'
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить корзину пользователя',
    description: 'Возвращает текущую корзину пользователя со всеми товарами или создает новую пустую корзину'
  })
  @ApiResponse({
    status: 200,
    description: 'Корзина успешно получена',
    type: CartResponseDto,
  })
  async getCart(@GetUser('userId') userId: string): Promise<CartResponseDto> {
    return this.cartService.getUserCart(userId);
  }

  @Post('add')
  @ApiOperation({ 
    summary: 'Добавить товар в корзину',
    description: 'Добавляет указанное количество блюда в корзину. Если блюдо уже есть в корзине, увеличивает его количество.'
  })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно добавлен в корзину',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или превышено максимальное количество товара',
  })
  @ApiResponse({
    status: 404,
    description: 'Блюдо не найдено или недоступно',
  })
  async addToCart(
    @GetUser('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Put('item/:itemId')
  @ApiOperation({ 
    summary: 'Обновить количество товара в корзине',
    description: 'Изменяет количество указанного блюда в корзине. Если количество равно 0, товар удаляется из корзины.'
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID блюда в меню',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Количество товара успешно обновлено',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректное количество',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден в корзине',
  })
  async updateCartItem(
    @GetUser('userId') userId: string,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
  }

  @Delete('item/:itemId')
  @ApiOperation({ 
    summary: 'Удалить товар из корзины',
    description: 'Полностью удаляет указанное блюдо из корзины, независимо от количества'
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID блюда в меню',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно удален из корзины',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден в корзине',
  })
  async removeFromCart(
    @GetUser('userId') userId: string,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(userId, itemId);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Очистить корзину полностью',
    description: 'Удаляет все товары из корзины пользователя и саму корзину'
  })
  @ApiResponse({
    status: 200,
    description: 'Корзина успешно очищена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Корзина успешно очищена',
        },
      },
    },
  })
  async clearCart(
    @GetUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.cartService.clearCart(userId);
  }
}