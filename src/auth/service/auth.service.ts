// src/auth/services/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../strategies/jwt.strategy';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
// Se UsersService.findById retorna um tipo específico do Prisma, importe-o (ex: User)
// import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userFromDb = await this.usersService.findByEmail(email);
    // Garanta que usersService.findByEmail retorna a senha para comparação.
    if (userFromDb && userFromDb.password && (await bcrypt.compare(pass, userFromDb.password))) {
      const { password, ...result } = userFromDb;
      return result;
    }
    return null;
  }

  async login(user: { id: number; email: string; name?: string | null }) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Usuário com este e-mail já existe.');
    }
    const userFromCreate = await this.usersService.create(createUserDto);
    return this.login(userFromCreate);
  }

  async getProfile(userId: number): Promise<any> { // Ajuste 'any' para o tipo de usuário retornado por findById (ex: Omit<User, 'password'>)
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return user; // findById já deve retornar o usuário sem a senha
  }
}