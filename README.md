# Nubbix Monorepo

Monorepo usando **Bun** + **Turborepo** com Next.js e Hono, seguindo princípios de Domain-Driven Design (DDD) e Clean Architecture.

## Pré-requisitos

- [Bun](https://bun.sh) instalado (versão 1.3.4 ou superior)
- Node.js 18+ (para compatibilidade)

## Estrutura do Repositório

```
/
├── apps/
│   ├── api/                    # Hono API (porta 3001)
│   │   ├── src/
│   │   │   └── modules/        # Módulos de domínio (DDD)
│   │   │       ├── accounts/   # Módulo de contas
│   │   │       └── identity/   # Módulo de identidade/usuários
│   │   ├── Dockerfile          # Docker para produção
│   │   ├── Dockerfile.dev      # Docker para desenvolvimento
│   │   └── index.ts            # Entry point da API
│   └── www/                    # Next.js App Router (porta 3000)
│       ├── app/                # Next.js App Router
│       └── public/             # Arquivos estáticos
├── packages/
│   ├── domain/                 # Pacote de domínio compartilhado
│   │   ├── src/
│   │   │   ├── entity/         # Entidades base
│   │   │   ├── vo/             # Value Objects
│   │   │   ├── repository/     # Interfaces de repositório
│   │   │   ├── usecase/        # Casos de uso base
│   │   │   └── errors/         # Erros de domínio
│   │   └── tests/              # Testes do pacote
│   ├── ui/                     # Design System (shadcn/ui)
│   │   └── src/
│   │       └── components/     # Componentes React reutilizáveis
│   └── tsconfig/               # Configurações TypeScript compartilhadas
│       └── base.json           # Config base do TS
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── turbo.json                  # Configuração Turborepo
├── package.json               # Root package.json com workspaces
├── docker-compose.yml         # Docker Compose para desenvolvimento
└── README.md                  # Este arquivo
```

## Arquitetura

### Diagrama de Dependências

```
apps/www (Next.js)
    ├── @nubbix/ui (Componentes UI)
    └── (pode consumir @nubbix/domain se necessário)

apps/api (Hono)
    └── @nubbix/domain (Entidades, VOs, Use Cases)

packages/domain
    └── (sem dependências de outros pacotes internos)

packages/ui
    └── (dependências externas: React, Radix UI, etc.)
```

### Princípios Arquiteturais

1. **Domain-Driven Design (DDD)**
   - Módulos organizados por domínio (`accounts`, `identity`)
   - Entidades e Value Objects no pacote `domain`
   - Separação clara entre domínio e infraestrutura

2. **Clean Architecture**
   - Camadas bem definidas (domain, application, infrastructure)
   - Dependências apontam para dentro (domínio no centro)
   - Testabilidade através de interfaces

3. **Monorepo com Turborepo**
   - Build incremental e cache inteligente
   - Execução paralela de tarefas
   - Dependências entre pacotes gerenciadas automaticamente

### Estrutura de Módulos (apps/api)

Cada módulo segue a estrutura:

```
modules/
└── [module-name]/
    └── domain/
        ├── __tests__/          # Testes unitários (.spec.ts)
        ├── [Entity].ts         # Entidades de domínio
        ├── vo/                 # Value Objects do módulo
        │   └── [VO].ts
        ├── exceptions/         # Exceções específicas do módulo
        └── index.ts            # Exports públicos
```

## Instalação

```bash
# Instalar todas as dependências
bun install
```

## Comandos

### Desenvolvimento

Inicia ambos os apps (www e api) em modo desenvolvimento com hot reload:

```bash
bun dev
```

Para iniciar apenas um app específico:

```bash
# Apenas API
cd apps/api && bun dev

# Apenas Web
cd apps/www && bun dev
```

### Build

Compila todos os pacotes e apps:

```bash
bun build
```

O Turborepo gerencia as dependências automaticamente, garantindo que os pacotes sejam construídos antes dos apps que os utilizam.

### Lint

Executa lint em todos os pacotes:

```bash
bun lint
```

### Typecheck

Verifica tipos TypeScript em todos os pacotes:

```bash
bun typecheck
```

### Testes

Executa todos os testes:

```bash
bun test
```

Para testes específicos de um pacote/app:

```bash
# Testes da API
cd apps/api && bun test

# Testes do pacote domain
cd packages/domain && bun test
```

### Scripts por Pacote

Cada pacote/app pode ter scripts específicos. Consulte o `package.json de cada um.

## Portas

- **www**: http://localhost:3000
- **api**: http://localhost:3001

## Variáveis de Ambiente

### API (apps/api/.env)

Crie o arquivo `.env` na pasta `apps/api/` com as seguintes variáveis:

```env
PORT=3001
NODE_ENV=development

# Database (se aplicável)
# DATABASE_URL=

# Authentication (se aplicável)
# JWT_SECRET=
# JWT_EXPIRES_IN=
```

### Web (apps/www/.env.local)

Crie o arquivo `.env.local` na pasta `apps/www/` com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Raiz do Projeto (.env)

Se necessário, crie um arquivo `.env` na raiz com variáveis compartilhadas.

## Adicionar Componentes shadcn/ui

Os componentes shadcn/ui devem ser adicionados no pacote `packages/ui`. Para adicionar um novo componente:

```bash
cd packages/ui
bunx --bun shadcn@latest add [component-name]
```

Os componentes ficam disponíveis em `apps/www` através do import:

```typescript
import { Button } from "@nubbix/ui/button";
```

## Convenções de Código

### Estrutura de Testes

- **Testes unitários**: Use `.spec.ts` e coloque em `__tests__/` dentro do módulo
- **Testes de integração**: Use `.test.ts` (quando aplicável)
- **Pacote domain**: Testes em `tests/` na raiz do pacote

### Nomenclatura

- **Entidades**: PascalCase (ex: `User`, `Account`)
- **Value Objects**: PascalCase (ex: `Email`, `Role`)
- **Arquivos**: kebab-case ou PascalCase para componentes React
- **Módulos**: camelCase (ex: `identity`, `accounts`)

### Imports

Use imports absolutos quando possível:

```typescript
// ✅ Bom
import { User } from "@nubbix/domain";
import { Button } from "@nubbix/ui/button";

// ❌ Evitar
import { User } from "../../../packages/domain/src";
```

## CI/CD

O projeto inclui GitHub Actions configurado em `.github/workflows/`:

### CI Workflow (`ci.yml`)

Executa automaticamente:

- **Lint**: Verificação de código em todos os pacotes
- **Typecheck**: Verificação de tipos TypeScript
- **Testes**: Execução de todos os testes
- **Build**: Compilação de todos os pacotes e apps

O workflow é executado em:

- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

### Database Migrations (`migrate.yml`)

Executa migrations do banco de dados automaticamente quando há mudanças no schema ou nas migrations.

**Configuração:**

1. Configure o secret `DATABASE_URL` no GitHub:
   - Vá em Settings → Secrets and variables → Actions
   - Adicione `DATABASE_URL` com a connection string do PostgreSQL de produção

2. O workflow executa automaticamente quando:
   - Push para `main` com mudanças em:
     - `apps/api/drizzle/**` (novas migrations)
     - `apps/api/src/shared/infrastructure/db/schema.ts` (mudanças no schema)
     - `apps/api/drizzle.config.ts` (configuração do Drizzle)

**Nota:** As migrations são executadas apenas na branch `main` para evitar aplicar migrations em ambientes de desenvolvimento.

## Docker

### Desenvolvimento

```bash
docker-compose up
```

### Produção

```bash
# Build da imagem
docker build -f apps/api/Dockerfile -t nubbix-api .

# Ou usando docker-compose
docker-compose -f docker-compose.yml up --build
```

Os Dockerfiles estão otimizados com:

- Multi-stage builds
- Cache de layers para dependências
- Usuário não-root para segurança
- Health checks configurados

## Tecnologias

- **Bun**: Runtime, package manager e bundler
- **Turborepo**: Build system para monorepos com cache inteligente
- **Next.js 16**: Framework React para `apps/www`
- **Hono**: Web framework rápido para `apps/api`
- **TypeScript**: Tipagem estática em todo o projeto
- **shadcn/ui**: Design system em `packages/ui`
- **ESLint**: Linting de código
- **Zod**: Validação de schemas

## Qualidade de Código

### Prettier

O projeto usa Prettier para formatação automática de código:

```bash
# Formatar todo o código
bun run format

# Verificar formatação
bun run format:check
```

### Husky & Commitlint

Hooks do Git configurados para garantir qualidade:

- **pre-commit**: Executa formatação e lint antes de cada commit
- **commit-msg**: Valida mensagens de commit seguindo Conventional Commits

Formato de commits:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Exemplo:

```
feat(api): add user authentication endpoint
```

## Contribuindo

1. Crie uma branch a partir de `develop`
2. Faça suas alterações seguindo as convenções
3. Execute `bun run format` para formatar o código
4. Execute `bun lint` e `bun typecheck` antes de commitar
5. Certifique-se de que todos os testes passam: `bun test`
6. Siga o formato Conventional Commits nas mensagens
7. Abra um Pull Request

## Estrutura de Dependências

### Pacotes Compartilhados

- **@nubbix/domain**: Entidades, Value Objects, interfaces e casos de uso base
- **@nubbix/ui**: Componentes React reutilizáveis

### Apps

- **apps/api**: Consome `@nubbix/domain`
- **apps/www**: Consome `@nubbix/ui` (e pode consumir `@nubbix/domain` se necessário)

### Regras de Dependência

- Apps podem depender de pacotes
- Pacotes **não podem** depender de apps
- Pacotes podem depender de outros pacotes (com cuidado para evitar ciclos)
