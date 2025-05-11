// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Opcional: log das queries em desenvolvimento
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Opcional: um método para limpar o banco de dados em testes e2e
  // async cleanDatabase() {
  //   if (process.env.NODE_ENV === 'test') { // ou outra variável de ambiente
  //     // A ordem de deleção importa devido às Foreign Keys
  //     await this.post.deleteMany();
  //     await this.user.deleteMany();
  //   }
  // }
}
