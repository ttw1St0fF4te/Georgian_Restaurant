import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens = new Map<string, number>(); // token -> expiration timestamp

  addToBlacklist(token: string): void {
    // Извлекаем время истечения из JWT токена
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const exp = payload.exp * 1000; // Конвертируем в миллисекунды
      this.blacklistedTokens.set(token, exp);
    } catch (error) {
      // Если не можем парсить токен, добавляем с текущим временем + 24 часа
      const expiration = Date.now() + (24 * 60 * 60 * 1000);
      this.blacklistedTokens.set(token, expiration);
    }
  }

  isBlacklisted(token: string): boolean {
    if (!this.blacklistedTokens.has(token)) {
      return false;
    }
    
    // Проверяем, не истек ли токен
    const expiration = this.blacklistedTokens.get(token);
    if (expiration && Date.now() > expiration) {
      // Токен истек, удаляем его из blacklist
      this.blacklistedTokens.delete(token);
      return false;
    }
    
    return true;
  }

  // Очистка истекших токенов (можно вызывать по расписанию)
  clearExpiredTokens(): void {
    const now = Date.now();
    for (const [token, expiration] of this.blacklistedTokens.entries()) {
      if (now > expiration) {
        this.blacklistedTokens.delete(token);
      }
    }
  }

  // Получить количество токенов в blacklist
  getBlacklistSize(): number {
    return this.blacklistedTokens.size;
  }
}