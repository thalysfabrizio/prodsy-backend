// test/app.e2e-spec.ts (Backend)
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apiPort: number;

  beforeAll(async () => { // 'beforeAll' em vez de 'beforeEach' para não recriar o app a cada 'it'
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Importa seu AppModule principal
    }).compile();

    app = moduleFixture.createNestApplication();
    // Aplicar o mesmo ValidationPipe global usado em main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    const configService = app.get(ConfigService);
    apiPort = configService.get<number>('API_PORT', 3001); // Pega a porta

    await app.init();
    // Se estiver usando um servidor HTTP diferente do padrão, use-o aqui
    // await app.listen(apiPort); // Não precisa mais disso aqui com app.getHttpServer()
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()) // Usa o servidor HTTP real da aplicação
      .get('/')
      .expect(200)
      .expect('Hello World!'); // Ou o que sua rota raiz do AppController retornar
  });

  // Exemplo de teste para a rota de registro (POST /auth/register)
  describe('/auth/register (POST)', () => {
    const testUser = {
      email: `testuser-${Date.now()}@example.com`, // Email único para cada execução
      name: 'Test User E2E',
      password: 'Password123!',
    };

    // Limpar usuário após o teste se ele for criado
    // afterAll(async () => {
    //   const prisma = app.get(PrismaService); // Se PrismaService for global e exportado
    //   await prisma.user.deleteMany({ where: { email: testUser.email }});
    // });

    it('should register a new user and return a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201); // HttpStatus.CREATED

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toEqual(testUser.email);
    });

    it('should fail if email already exists', async () => {
      // Primeira tentativa (deve funcionar)
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testUser, email: `conflict-${testUser.email}` }) // Novo email para este teste
        .expect(201);

      // Segunda tentativa com o mesmo email (deve falhar com 409 Conflict)
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testUser, email: `conflict-${testUser.email}` })
        .expect(409);
    });

    it('should fail with validation errors for invalid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'short' })
        .expect(400) // HttpStatus.BAD_REQUEST
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'O e-mail fornecido é inválido.',
              'A senha deve ter pelo menos 8 caracteres.',
            ]),
          );
        });
    });
  });


  afterAll(async () => {
    await app.close();
  });
});