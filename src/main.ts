import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api'); // faz todas as rotas da aplicação terem o prefixo /api, por exemplo, a rota de login vai ser /api/auth/login
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // whitelist: descarta campos que não estão no DTO; transform: converte o corpo da requisição em uma instância do DTO
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
