import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// [LOCAL] Validação da troca de senha: senha atual e nova senha
export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword: string = '';

  @IsString()
  @MinLength(8)
  newPassword: string = '';
}
