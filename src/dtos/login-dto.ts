import { IsEmail, IsString } from 'class-validator';
// Dados do login
export class LoginDto {
  @IsEmail() email: string = '';
  @IsString() password: string = '';
}
