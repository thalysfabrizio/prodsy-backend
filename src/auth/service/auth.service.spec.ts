// src/auth/service/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service'; // Ajuste o caminho se o seu for um pouco diferente
import { UsersService } from '../../users/services/users.service'; // Ajuste o caminho se necessário
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Importe se o JwtService real precisaria dele no setup do módulo

describe('AuthService', () => {
  let service: AuthService;
  // Crie mocks para as dependências
  let mockUsersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let mockJwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    // Defina os mocks
    mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      // Adicione outros métodos do UsersService que o AuthService usa, se houver
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'), // Exemplo de retorno para o método sign
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, // O serviço que estamos testando
        {
          provide: UsersService,
          useValue: mockUsersService, // Fornece o mock do UsersService
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Fornece o mock do JwtService
        },
        // O ConfigService geralmente é fornecido globalmente pelo ConfigModule.forRoot({isGlobal: true})
        // Se o JwtService real (não mockado) fosse usado e configurado via JwtModule.registerAsync
        // com ConfigService, você poderia precisar mockar ConfigService aqui também,
        // mas como estamos mockando JwtService diretamente, isso pode não ser necessário para este unit test.
        // { provide: ConfigService, useValue: { get: jest.fn() } } // Exemplo se fosse necessário
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});