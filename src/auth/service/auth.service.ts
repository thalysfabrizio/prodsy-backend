import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../strategies/jwt.strategy';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> { 
    const userFromDb = await this.usersService.findByEmail(email);
    if (userFromDb && userFromDb.password && (await bcrypt.compare(pass, userFromDb.password))) {
      const { password, ...result } = userFromDb;
      return result;
    }
    return null;
  }

  async login(user: { id: string; email: string; name?: string | null; role?: string }) { 

    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Usuário com este e-mail já existe.');
    }
    const userFromCreate = await this.usersService.create(createUserDto);

    return this.login({
        id: userFromCreate.id,
        email: userFromCreate.email,
        name: userFromCreate.name,
        role: userFromCreate.role,
    });
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return user;
  }
}