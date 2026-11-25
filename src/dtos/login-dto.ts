import { IsEmail, IsString } from 'class-validator';
// [LOCAL] Validação do login: e-mail válido e senha
export class LoginDto {
  @IsEmail() email: string = '';
  @IsString() password: string = '';
}
