import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens = new Set<string>();

  addToBlacklist(token: string): void {
    this.blacklistedTokens.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  // Очистка истекших токенов (можно вызывать по расписанию)
  clearExpiredTokens(): void {
    // В реальном приложении здесь была бы логика проверки exp времени
    // Для упрощения пока оставляем пустой
  }
}