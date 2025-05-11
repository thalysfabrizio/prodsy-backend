// src/auth/controllers/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto'; // Ajuste o caminho
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; // Usaremos o guard padrão 'jwt'

// Se você quiser um guard local para login com email/senha, crie-o e importe.
// Por enquanto, o login não será protegido por um guard, ele *gera* o token.

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // O login não usa um Guard que valida token, pois é aqui que o token é gerado.
  // Poderia ter um 'LocalAuthGuard' para validar email/senha antes de chamar o serviço,
  // mas para simplificar, vamos validar no serviço.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.authService.login(user);
  }

  // Rota protegida de exemplo
  @UseGuards(AuthGuard('jwt')) // Protege esta rota com a estratégia JWT
  @Get('profile')
  getProfile(@Request() req) {
    // req.user é populado pela JwtStrategy após validar o token
    return req.user;
  }
}