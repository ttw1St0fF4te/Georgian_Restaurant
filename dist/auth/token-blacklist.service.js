"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
let TokenBlacklistService = class TokenBlacklistService {
    constructor() {
        this.blacklistedTokens = new Map();
    }
    addToBlacklist(token) {
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const exp = payload.exp * 1000;
            this.blacklistedTokens.set(token, exp);
        }
        catch (error) {
            const expiration = Date.now() + (24 * 60 * 60 * 1000);
            this.blacklistedTokens.set(token, expiration);
        }
    }
    isBlacklisted(token) {
        if (!this.blacklistedTokens.has(token)) {
            return false;
        }
        const expiration = this.blacklistedTokens.get(token);
        if (expiration && Date.now() > expiration) {
            this.blacklistedTokens.delete(token);
            return false;
        }
        return true;
    }
    clearExpiredTokens() {
        const now = Date.now();
        for (const [token, expiration] of this.blacklistedTokens.entries()) {
            if (now > expiration) {
                this.blacklistedTokens.delete(token);
            }
        }
    }
    getBlacklistSize() {
        return this.blacklistedTokens.size;
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)()
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map