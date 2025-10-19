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
exports.AddressDto = void 0;
const class_validator_1 = require("class-validator");
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Страна должна быть строкой' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Название страны должно быть от 2 до 50 символов' }),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Город должен быть строкой' }),
    (0, class_validator_1.Length)(2, 100, { message: 'Название города должно быть от 2 до 100 символов' }),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Улица должна быть строкой' }),
    (0, class_validator_1.Length)(5, 255, { message: 'Адрес должен быть не менее 5 символов' }),
    __metadata("design:type", String)
], AddressDto.prototype, "street_address", void 0);
//# sourceMappingURL=address.dto.js.map