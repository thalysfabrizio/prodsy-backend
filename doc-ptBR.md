# Prodsy API (Backend)

## Descrição

API RESTful backend para a plataforma Prodsy, construída com NestJS, TypeScript e Prisma para fornecer endpoints robustos, seguros e escaláveis.

## Tech Stack

* **Framework Principal:** NestJS (versão ~10.x)
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL (gerenciado via Docker Compose)
* **ORM:** Prisma
* **Cache:** Redis (gerenciado via Docker Compose, integrado com `CacheModule` do NestJS usando `@keyv/redis`)
* **Autenticação & Autorização:** Passport.js com estratégias JWT (JSON Web Tokens)
* **Validação de Dados (DTOs):** `class-validator` e `class-transformer`
* **Testes Unitários/Integração:** Jest
* **Testes End-to-End (E2E):** Jest com Supertest
* **Linting:** ESLint
* **Formatação:** Prettier

## Pré-requisitos

* Node.js (versão 20.x ou superior é recomendada)
* `npm` (ou `yarn`/`pnpm` - ajuste os comandos)
* Docker e Docker Compose (ou Docker Desktop instalado e configurado para WSL 2)
* Git

## Começando (Getting Started)

1.  **Clone o repositório (se ainda não o fez):**
    ```
    git clone <url-do-seu-repositorio-backend>
    cd prodsy-api
    ```

2.  **Configure as Variáveis de Ambiente:**
    * Copie o arquivo `.env.example` (você deve criar este arquivo com as chaves necessárias) para `.env`:
        ```
        cp .env.example .env
        ```
    * Preencha as variáveis no arquivo `.env`. Exemplo de chaves necessárias:
        ```
        # .env
        # Banco de Dados (PostgreSQL)
        DATABASE_URL="postgresql://prodsyadmin:admin@localhost:5432/prodsy_db?schema=public"

        # Autenticação (JWT)
        JWT_SECRET="SEU_SEGREDO_JWT_SUPER_SEGURO_E_LONGO_AQUI"
        JWT_EXPIRES_IN="1h"

        # API
        API_PORT=3001

        # Cache (Redis)
        REDIS_URL="redis://localhost:6379"
        CACHE_TTL_MS=5000
        ```

3.  **Inicie os Serviços Docker (PostgreSQL e Redis):**
    Na raiz do projeto `prodsy-api` (onde está o `docker-compose.yml`):
    ```
    docker compose up -d
    ```

4.  **Instale as Dependências do Projeto:**
    ```
    npm install
    ```

5.  **Execute as Migrações do Prisma:**
    ```
    npx prisma migrate dev
    ```

6.  **Gere o Prisma Client (opcional, `migrate dev` geralmente já faz):**
    ```
    npx prisma generate
    ```

## Scripts Disponíveis

* **Rodar o Servidor de Desenvolvimento:**
    A API estará disponível em `http://localhost:3001` (ou a porta definida em `API_PORT`).
    ```
    npm run start:dev
    ```

* **Rodar Testes Unitários/Integração (Jest):**
    ```
    npm run test
    ```
    Para modo watch:
    ```
    npm run test:watch
    ```

* **Rodar Testes End-to-End (Jest com Supertest):**
    * Certifique-se de que o banco de dados está configurado (Docker rodando) e as migrações foram aplicadas.
    ```
    npm run test:e2e
    ```

* **Rodar Linter (ESLint):**
    ```
    npm run lint
    ```

* **Construir o Projeto para Produção (Build):**
    ```
    npm run build
    ```

* **Iniciar o Servidor de Produção (após o `build`):**
    ```
    npm run start:prod
    ```

## Migrações do Banco de Dados (Prisma)

* **Para criar uma nova migração após alterar `prisma/schema.prisma`:**
    ```
    npx prisma migrate dev --name nome_descritivo_da_migracao
    ```
* **Para aplicar migrações pendentes em um ambiente (ex: produção):**
    ```
    npx prisma migrate deploy
    ```
* **Para gerar o Prisma Client manualmente:**
    ```
    npx prisma generate
    ```
* **Para abrir o Prisma Studio (GUI para o banco de dados):**
    ```
    npx prisma studio
    ```

## Estrutura de Pastas Principal

* `src/`: Código fonte da aplicação NestJS.
    * `src/app.module.ts`: Módulo raiz.
    * `src/main.ts`: Arquivo de inicialização.
    * `src/prisma/`: `PrismaModule` e `PrismaService`.
    * `src/auth/`: Módulo de autenticação.
    * `src/users/`: Módulo de usuários.
    * `[outros-modulos]/`
* `prisma/`: Configuração do Prisma ORM.
    * `schema.prisma`: Definição dos modelos.
    * `migrations/`: Histórico de migrações.
* `test/`: Testes End-to-End (`*.e2e-spec.ts`) e `jest-e2e.json`.
* `docker-compose.yml`: Define os serviços Docker.
* `.env`: Variáveis de ambiente locais (NÃO versionado).
* `.env.example`: Exemplo de variáveis (versionado).
* `jest.config.js`: Configuração do Jest para testes unitários/integração.
* `.github/workflows/backend-ci.yml`: Workflow do GitHub Actions para CI.