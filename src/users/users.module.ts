// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
// PrismaModule já é global
// Não vamos expor um controller de Users neste exemplo simplificado

@Module({
  providers: [UsersService],
  exports: [UsersService], // Exporte UsersService para que AuthModule possa usá-lo
})
export class UsersModule {}