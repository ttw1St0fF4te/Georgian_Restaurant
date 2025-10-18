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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_category_entity_1 = require("../entities/menu-category.entity");
let MenuCategoriesService = class MenuCategoriesService {
    constructor(menuCategoryRepository) {
        this.menuCategoryRepository = menuCategoryRepository;
    }
    async findAll() {
        return this.menuCategoryRepository.find({
            order: {
                category_name: 'ASC',
            },
        });
    }
    async findOne(id) {
        const category = await this.menuCategoryRepository.findOne({
            where: { category_id: id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async create(createMenuCategoryDto) {
        const category = this.menuCategoryRepository.create(createMenuCategoryDto);
        return this.menuCategoryRepository.save(category);
    }
    async update(id, updateMenuCategoryDto) {
        const category = await this.findOne(id);
        Object.assign(category, updateMenuCategoryDto);
        category.updated_at = new Date();
        return this.menuCategoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.menuCategoryRepository.remove(category);
    }
};
exports.MenuCategoriesService = MenuCategoriesService;
exports.MenuCategoriesService = MenuCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_category_entity_1.MenuCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuCategoriesService);
//# sourceMappingURL=menu-categories.service.js.map