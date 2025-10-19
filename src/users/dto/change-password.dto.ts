import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Текущий пароль должен быть строкой' })
  @Length(1, 50, { message: 'Введите текущий пароль, пожалуйста' })
  current_password: string;

  @IsString({ message: 'Новый пароль должен быть строкой' })
  @Length(8, 50, { message: 'Новый пароль должен быть от 8 до 50 символов' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, { message: 'Новый пароль должен содержать заглавную, строчную букву, число и спецсимвол' })
  new_password: string;
}
