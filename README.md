# Nubbix Monorepo

Monorepo boilerplate usando **Bun** + **Turborepo** com Next.js e Hono.

## Pré-requisitos

- [Bun](https://bun.sh) instalado (versão mais recente)

## Estrutura do Repositório

```
/
├── apps/
│   ├── api/          # Hono API (porta 3001)
│   └── www/          # Next.js App Router (porta 3000)
├── packages/
│   └── ui/            # shadcn/ui Design System
├── turbo.json        # Configuração Turborepo
├── package.json      # Root package.json com workspaces
├── packages/
│   ├── tsconfig/      # TypeScript config compartilhado
│   └── ui/            # shadcn/ui Design System
└── README.md         # Este arquivo
```

## Instalação

```bash
bun install
```

## Comandos

### Desenvolvimento

Inicia ambos os apps (www e api) em modo desenvolvimento:

```bash
bun dev
```

### Build

Compila todos os pacotes e apps:

```bash
bun build
```

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

## Portas

- **www**: http://localhost:3000
- **api**: http://localhost:3001

## Adicionar Componentes shadcn/ui

Os componentes shadcn/ui devem ser adicionados no pacote `packages/ui`. Para adicionar um novo componente:

```bash
cd packages/ui
bunx --bun shadcn@latest add [component-name]
```

Os componentes ficam disponíveis em `apps/www` através do import:

```typescript
import { Button } from "@nubbix/ui/button"
```

## Tecnologias

- **Bun**: Runtime, package manager e bundler
- **Turborepo**: Build system para monorepos
- **Next.js**: Framework React para `apps/www`
- **Hono**: Web framework para `apps/api`
- **shadcn/ui**: Design system em `packages/ui`

