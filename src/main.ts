import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // faz todas as rotas da aplicação terem o prefixo /api, por exemplo, a rota de login vai ser /api/auth/login
  app.useGlobalPipes(new ValidationPipe()); // ativa as validações dos DTOs, caso algum campo não seja passado ou seja inválido, vai retornar um erro 400
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
