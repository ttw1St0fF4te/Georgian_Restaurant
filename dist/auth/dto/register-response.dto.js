"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RegisterResponseDto {
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус регистрации',
        example: 'success',
    }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате регистрации',
        example: 'Пользователь успешно зарегистрирован. Пожалуйста, войдите в систему.',
    }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Информация о созданном пользователе',
        example: {
            user_id: 'd5669069-0e13-4c97-a07d-381c12f37142',
            username: 'new_user',
            email: 'user@example.com',
            first_name: 'Имя',
            last_name: 'Фамилия',
            role: 'user',
            role_id: 3,
        },
    }),
    __metadata("design:type", Object)
], RegisterResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время регистрации',
        example: '2025-10-19T20:15:30.000Z',
    }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "created_at", void 0);
//# sourceMappingURL=register-response.dto.js.map