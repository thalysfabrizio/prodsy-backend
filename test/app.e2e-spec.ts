// test/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common'; // Adicionado ValidationPipe para o exemplo
import * as request from 'supertest';
import { AppModule } from './../src/app.module'; // Corrigido o caminho presumindo que 'src' está um nível acima de 'test'

describe('AppController (e2e)', () => {
  let app: INestApplication; // Tipagem simplificada

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close(); // Garante que a aplicação seja fechada após cada teste
  });

  it('/ (GET) should return Hello World!', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

});