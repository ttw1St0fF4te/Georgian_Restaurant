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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Имя должно быть строкой' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Имя должно быть от 2 до 50 символов' }),
    (0, class_validator_1.Matches)(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
        message: 'Имя может содержать только буквы, пробелы и дефисы'
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Фамилия должна быть строкой' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Фамилия должна быть от 2 до 50 символов' }),
    (0, class_validator_1.Matches)(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
        message: 'Фамилия может содержать только буквы, пробелы и дефисы'
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Телефон должен быть строкой' }),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{8,14}$/, {
        message: 'Телефон должен быть в международном формате, например +79161234567'
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Страна должна быть строкой' }),
    (0, class_validator_1.Length)(2, 100, { message: 'Название страны должно быть от 2 до 100 символов' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Город должен быть строкой' }),
    (0, class_validator_1.Length)(2, 100, { message: 'Название города должно быть от 2 до 100 символов' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Адрес должен быть строкой' }),
    (0, class_validator_1.Length)(5, 500, { message: 'Адрес должен быть от 5 до 500 символов' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "street_address", void 0);
//# sourceMappingURL=update-profile.dto.js.map