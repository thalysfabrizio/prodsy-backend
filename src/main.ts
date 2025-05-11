// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Para pegar a porta do .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para o frontend Next.js
  app.enableCors({
    origin: 'http://localhost:3000', // Ou a URL do seu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO (Data Transfer Object)
      forbidNonWhitelisted: true, // Lança erro se propriedades não permitidas forem enviadas
      transform: true, // Transforma o payload para o tipo do DTO (ex: string de query param para number)
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita
      },
    }),
  );

  const configService = app.get(ConfigService); // Obter ConfigService
  const port = configService.get<number>('API_PORT', 3001); // Usar porta do .env ou 3001 como padrão

  await app.listen(port);
  console.log(`🚀 Aplicação Backend rodando na porta: ${port}`);
}
bootstrap();
