// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module'; // Importe UsersModule

@Module({
  imports: [
    UsersModule, // Disponibiliza UsersService para injeção
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para usar ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60m'), // Ex: 60m, 1d, 7d
        },
      }),
      inject: [ConfigService], // Injeta ConfigService
    }),
    ConfigModule, // Garante que ConfigService está disponível
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // Exporte JwtModule se outros módulos precisarem dele
})
export class AuthModule {}