import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { LoginDto } from 'src/dtos/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200) // login não cria nada, então responde 200 em vez do 201 padrão do POST
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('register')
  register(@Body() dto: CreateUserDTO) {
    return this.auth.register(dto);
  }
}