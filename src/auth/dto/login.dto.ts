import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O campo e-mail não pode estar vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;
}