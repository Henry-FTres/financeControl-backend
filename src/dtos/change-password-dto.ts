import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// Dados para trocar a senha
export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string = '';

  @IsString()
  @MinLength(8)
  newPassword: string = '';
}
