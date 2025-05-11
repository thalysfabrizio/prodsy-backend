// src/users/services/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service'; // Ajuste o caminho se necessário

// Crie um objeto mock para o PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(), // Adicione outros métodos que UsersService usa
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Se UsersService usar outros modelos (ex: prisma.post), mock eles também
  // post: { ... }
};

describe('UsersService', () => {
  let service: UsersService;
  // Opcional: se você quiser acessar o mock do prisma diretamente nos testes
  // let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // O serviço que estamos testando
        {
          provide: PrismaService,       // O token do provider real
          useValue: mockPrismaService,  // O valor mockado que será injetado
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // prisma = module.get(PrismaService); // Para pegar a instância do mock
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', password: 'hashedpassword', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser); // Configure o mock para retornar um usuário

      const result = await service.findById(1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = mockUser; // O serviço omite a senha
      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null); // Configure o mock para retornar null
      const result = await service.findById(99);
      expect(result).toBeNull();
    });
  });
});