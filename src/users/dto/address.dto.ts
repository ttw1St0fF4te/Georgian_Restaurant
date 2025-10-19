import { IsString, Length, Matches, IsOptional } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'Страна должна быть строкой' })
  @Length(2, 50, { message: 'Название страны должно быть от 2 до 50 символов' })
  country: string;

  @IsString({ message: 'Город должен быть строкой' })
  @Length(2, 100, { message: 'Название города должно быть от 2 до 100 символов' })
  city: string;

  @IsString({ message: 'Улица должна быть строкой' })
  @Length(5, 255, { message: 'Адрес должен быть не менее 5 символов' })
  street_address: string;

}
