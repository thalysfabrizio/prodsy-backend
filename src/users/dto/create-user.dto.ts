// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O campo e-mail não pode estar vazio.' })
  email: string;

  @IsString()
  @IsOptional() // Torna o campo nome opcional
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  name?: string; // O '?' também o torna opcional no TypeScript

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;
}
