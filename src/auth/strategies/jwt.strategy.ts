// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common'; // Adicionado InternalServerErrorException
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';

export interface JwtPayload {
  sub: number; // id do usuário
  email: string;
  // Adicione outros campos que você colocou no payload do token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Lançar um erro mais específico ou logar aqui é uma boa prática
      throw new InternalServerErrorException('JWT_SECRET não está definido nas variáveis de ambiente.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Agora 'secret' é garantidamente uma string aqui
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido.');
    }
    return { userId: payload.sub, email: payload.email /*, outros campos do usuário */ };
  }
}