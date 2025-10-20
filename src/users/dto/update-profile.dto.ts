import { IsString, Length, Matches, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 50, { message: 'Имя должно быть от 2 до 50 символов' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, { 
    message: 'Имя может содержать только буквы, пробелы и дефисы' 
  })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'Фамилия должна быть строкой' })
  @Length(2, 50, { message: 'Фамилия должна быть от 2 до 50 символов' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, { 
    message: 'Фамилия может содержать только буквы, пробелы и дефисы' 
  })
  last_name?: string;

  @IsOptional()
  @IsString({ message: 'Телефон должен быть строкой' })
  @Matches(/^\+?[1-9]\d{8,14}$/, { 
    message: 'Телефон должен быть в международном формате, например +79161234567' 
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Страна должна быть строкой' })
  @Length(2, 100, { message: 'Название страны должно быть от 2 до 100 символов' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Город должен быть строкой' })
  @Length(2, 100, { message: 'Название города должно быть от 2 до 100 символов' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Адрес должен быть строкой' })
  @Length(5, 500, { message: 'Адрес должен быть от 5 до 500 символов' })
  street_address?: string;
}
