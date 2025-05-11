// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as keyvRedisStore from '@keyv/redis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CacheModule.registerAsync({
      // Início do objeto de configuração do CacheModule
      isGlobal: true,
      imports: [ConfigModule], // Correto: Módulos necessários para o useFactory
      useFactory: async (configService: ConfigService) => ({
        // Correto: 'useFactory' é a chave, o valor é uma função async
        store: keyvRedisStore,
        uri:
          configService.get<string>('REDIS_URL') ||
          `redis://${configService.get<string>(
            'REDIS_HOST',
            'localhost',
          )}:${configService.get<number>('REDIS_PORT', 6379)}`,
        ttl: configService.get<number>('CACHE_TTL_MS', 5000),
      }), // Fim do objeto retornado pela função useFactory
      inject: [ConfigService], // Correto: Dependências injetadas no useFactory
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
