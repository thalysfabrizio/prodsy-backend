// src/auth/controller/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller'; // Ajuste o caminho se necessário
import { AuthService } from '../service/auth.service'; // Ajuste o caminho se necessário

describe('AuthController', () => {
  let controller: AuthController;
  // Crie um mock para AuthService
  let mockAuthService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      getProfile: jest.fn(), // Supondo que seu controller chame um método getProfile no AuthService
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController], // O controller que estamos testando
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Fornece o mock do AuthService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});