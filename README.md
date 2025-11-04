<div align="center">

# 🍲 UAIFood

Aplicação web para gestão de pedidos em restaurante (no local), com foco em simplicidade, rapidez e identidade mineira.

Frontend em **React (Vite + TypeScript + Tailwind CSS)** e Backend em **Node.js (Express + Prisma + PostgreSQL)**. Documentação de API via **Swagger** e autenticação **JWT**.

</div>

---

## 📋 Sobre o Projeto

O UAIFood conecta clientes e restaurante em um fluxo direto: visualizar cardápio, montar carrinho e finalizar pedido na mesa. Para a administração, oferece painel para manter cardápio e usuários sob controle, com hierarquia de permissões (Cliente, Admin e Root).

### 🎯 Principais Funcionalidades

- Cadastro e login de usuários (JWT) com controle de roles: CLIENTE, ADMIN e ROOT.
- Cardápio com categorias e itens (CRUD para administradores).
- Carrinho com soma de itens e finalização de pedido (mesa e método de pagamento).
- Histórico de pedidos do usuário.
- Painel administrativo para gerenciar itens e usuários (Root tem poderes estendidos).
- Documentação da API com Swagger.

### 🛠️ Tecnologias

#### Frontend
- React + Vite + TypeScript
- React Router
- Tailwind CSS

#### Backend
- Node.js + Express
- Prisma (PostgreSQL)
- JWT + Bcrypt.js
- Swagger UI

#### Ambiente
- Docker (PostgreSQL)
- VS Code
- Git

---

## 🚀 Como rodar (Linux Mint)

Pré‑requisitos: Docker, Node 20+, npm.

### Banco de Dados

No diretório raiz:

```bash
~/ADS/5 Quinto Período/DAW II/uaifood$ docker compose up -d
```

### Backend

Copie `.env.example` para `.env` e ajuste se necessário.

```bash
~/ADS/5 Quinto Período/DAW II/uaifood/backend$ npm install
~/ADS/5 Quinto Período/DAW II/uaifood/backend$ npx prisma migrate dev
~/ADS/5 Quinto Período/DAW II/uaifood/backend$ npm run seed
~/ADS/5 Quinto Período/DAW II/uaifood/backend$ npm run dev
```

Swagger: http://localhost:3333/docs

### Frontend

```bash
~/ADS/5 Quinto Período/DAW II/uaifood/frontend$ npm install
~/ADS/5 Quinto Período/DAW II/uaifood/frontend$ npm run dev
```

Acesse: http://localhost:5173

## Estrutura

- backend: API Express + Prisma
- frontend: React + Vite + Tailwind
- docker-compose: PostgreSQL local

## Rotas principais

- Autenticação: `POST /api/auth/register`, `POST /api/auth/login`
- Cardápio público: `GET /api/menu`
- Usuário logado: `GET /api/users/me`
- Admin: CRUD de itens `POST/PATCH/DELETE /api/menu/items`

## Credenciais de teste

- ROOT: root@uaifood.com / root123 (criado pelo seed)

---

## 📦 Estrutura sugerida de pastas

- `backend/` – API Express + Prisma + Swagger
  - `src/` rotas, middlewares e servidor
  - `prisma/` schema e migrations
- `frontend/` – React + Vite + Tailwind
  - `src/components` componentes reutilizáveis
  - `src/pages` páginas (Home, Cardápio, Sobre, Login, Cadastro, Carrinho)

---

# 🗓️ Roteiro de Entregas (04 a 19 de Novembro)

Este roteiro define as entregas planejadas do projeto **UAIFood**.

---

## 📅 Cronograma Geral

| Fase | Período | Objetivo |
|------|----------|-----------|
| 🧩 Fase 1 | 04–06 nov | Estrutura inicial e banco de dados |
| 🔐 Fase 2 | 07–09 nov | Autenticação e perfis de usuário |
| 🍽️ Fase 3 | 10–13 nov | Cardápio, carrinho e pedidos |
| 🧑‍💼 Fase 4 | 14–16 nov | Painel administrativo |
| 🎨 Fase 5 | 17–19 nov | Polimento, testes e apresentação |

---

## 🧩 Fase 1 — Base do Projeto e Banco de Dados (04–06/nov)

**🎯 Objetivo:** Preparar a estrutura do sistema e garantir que o backend tenha base sólida.

### ✅ Tarefas

- [✅] Criar repositório no Git e estrutura de pastas (`frontend/` e `backend/`)
- [✅] Configurar ambiente (Node, Docker, PostgreSQL, VS Code, Prisma)
- [✅] Criar projeto React com Vite + Tailwind (estrutura inicial, rotas e páginas)
- [✅] Criar projeto Express com TypeScript (API base)
- [✅] Escrever README com instruções de execução
- [✅] Definir modelo do banco no Prisma:
  - Usuário  
  - Endereço  
  - Categoria  
  - Item  
  - Pedido  
  - ItemPedido
- [✅] Rodar `prisma migrate dev` e confirmar estrutura no banco
- [✅] Criar `seed` com dados iniciais
- [✅] Implementar rotas iniciais:
  - `/users`
  - `/items`
  - `/categories`
- [✅] Configurar Swagger e testar rotas via Insomnia/Postman

---

## 🔐 Fase 2 — Autenticação e Perfis de Usuário (07–09/nov)

**🎯 Objetivo:** Implementar o sistema de login, cadastro e controle de permissões.

### ✅ Tarefas

- [✅] Implementar autenticação com JWT + Bcrypt
- [✅] Criar middlewares:
  - `verifyToken`
  - `isAdmin`
  - `isRoot`
- [✅] Criar rotas `/auth/login` e `/auth/register`
- [✅] Conectar frontend com backend (páginas de Login/Cadastro chamando API)
- [✅] Criar páginas:
  - Login  
  - Cadastro
- [ ] Implementar controle de rotas protegidas com React Router
- [ ] Navbar dinâmica (foto de perfil, logout, etc.)
- [ ] Página de perfil com dados do usuário logado

---

## 🍽️ Fase 3 — Cardápio e Carrinho (10–13/nov)

**🎯 Objetivo:** Permitir ao cliente visualizar o menu e montar pedidos.

### ✅ Tarefas

- [ ] Criar rotas backend:
  - `/menu` (listar itens e categorias)
  - `/orders` (criar e listar pedidos)
- [✅] Implementar modelos `Item` e `OrderItem` no Prisma
- [ ] Criar endpoints para adicionar/remover itens do pedido
- [✅] Página **Cardápio**:
  - Categorias em abas (tabs)
  - Cards de itens com botão “Adicionar ao Carrinho”
- [ ] Estado global/contexto para o carrinho
- [ ] Ícone do carrinho na navbar com contador
- [✅] Página **Carrinho** (placeholder inicial):
  - Listagem de itens, total, botão “Finalizar Pedido”
  - Modal de confirmação (mesa, pagamento, total)
- [ ] Página **Meus Pedidos**:
  - Histórico do usuário com status e valores

---

## 🧑‍💼 Fase 4 — Painel Administrativo (14–16/nov)

**🎯 Objetivo:** Permitir que administradores e o root gerenciem usuários e cardápio.

### ✅ Tarefas

- [ ] Criar rota `/admin/items` com CRUD completo de pratos
- [ ] Página **Gerenciar Cardápio**:
  - Tabela com nome, preço, categoria
  - Botões “Editar”, “Excluir” e “Adicionar Prato”
- [ ] Criar rota `/admin/users`
- [ ] Página **Gerenciar Usuários**:
  - Listagem de contas (nome, tipo)
  - Dropdown para trocar tipo (Usuário ↔ Admin)
  - Botão “Excluir Conta”
- [ ] Painel Root:
  - Pode editar senha de qualquer usuário
  - Pode promover/rebaixar admins
  - Pode excluir qualquer conta
- [ ] Página **Dashboard** (opcional):
  - Total de usuários, pedidos e itens cadastrados

---

## 🎨 Fase 5 — Polimento e Apresentação (17–19/nov)

**🎯 Objetivo:** Melhorar UX, corrigir bugs e preparar o sistema para entrega.

### ✅ Tarefas

- [ ] Adicionar animações leves (fade, hover, slide)
- [ ] Mensagens de sucesso e erro (toasts)
- [ ] Melhorar responsividade com Tailwind
- [ ] Revisar fluxo completo:
  - Login → Cardápio → Pedido → Histórico
  - Admin → Painel → Usuários/Cardápio
- [✅] Revisar documentação Swagger (disponível em /docs)
- [ ] Escrever README final detalhado:
  - Como rodar o projeto  
  - Estrutura de pastas  
  - Credenciais de teste  
- [ ] Criar vídeo curto ou slides de apresentação
- [ ] (Opcional) Deploy em Vercel + Render ou Docker Compose local

---

## ⚙️ Bônus (caso sobre tempo)

- [ ] Upload de imagem para pratos
- [ ] Paginação simples em listas grandes
- [ ] Tema escuro/claro
- [ ] Logs administrativos de ações

---

### 🏁 Entrega Final — 19 de Novembro
Apresentação do projeto **UAIFood** totalmente funcional, com:
- Fluxo completo de pedidos e autenticação  
- Painel administrativo e root operacional  
- Documentação finalizada  
- Interface moderna e responsiva  

---