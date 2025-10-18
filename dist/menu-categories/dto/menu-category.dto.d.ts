export declare class MenuCategoryResponseDto {
    category_id: number;
    category_name: string;
    category_description?: string;
    created_at: Date;
    updated_at: Date;
}
export declare class CreateMenuCategoryDto {
    category_name: string;
    category_description?: string;
}
export declare class UpdateMenuCategoryDto {
    category_name?: string;
    category_description?: string;
}
