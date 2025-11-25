# UAIFood – Guia de Fluxos CRUD (Backend e Frontend)

Este documento explica, passo a passo, como cada CRUD do projeto funciona, apontando os arquivos relevantes no backend (rotas, middlewares, controllers, models) e no frontend (páginas, contexts, componentes). Inclui o caminho completo e a ordem de execução para facilitar debug e evolução.

Base URL (backend): `http://localhost:3333/api`
Header de auth: `x-access-token: <JWT>`

---

## Visão Geral de Infra
- Backend (Express + Prisma)
  - Router raiz: `backend/src/routes/index.ts`
  - Middlewares globais: `backend/src/server.ts` (helmet, cors, json, morgan)
  - Autenticação e roles: `backend/src/core/auth.ts`
  - Validação (Zod): `backend/src/core/validate.ts`
  - Respostas padrão: `backend/src/core/responses.ts`
  - Tratador de erros: `backend/src/core/errorHandler.ts`
  - Prisma: `backend/src/core/prisma.ts` e schema em `backend/prisma/schema.prisma`
  - Swagger: `backend/src/swagger/*`
- Frontend (React + Vite)
  - Entradas: `frontend/src/main.tsx`, `frontend/src/App.tsx`
  - Contextos: `frontend/src/contexts/AuthContext.tsx`, `frontend/src/contexts/CartContext.tsx`
  - UI base: `frontend/src/components/*`, páginas em `frontend/src/pages/*`
  - Proxy Vite para a API: `frontend/vite.config.ts` (`/api` → `http://localhost:3333`)

---

## Auth (Login e Registro)

### Backend
- Rotas: `backend/src/routes/auth.routes.ts`
  - `POST /api/auth/login`
    - Middlewares: `validateBody(loginSchema)` (`backend/src/validation/auth.schemas.ts`)
    - Controller inline: valida credenciais com Prisma, gera JWT via `core/jwt.ts`, responde com `{ ok: true, data: { token, user } }`.
  - `POST /api/auth/register`
    - Middlewares: `validateBody(registerSchema)`
    - Controller inline: cria usuário (hash com `bcryptjs`), responde com envelope padrão.
- Middlewares de apoio:
  - `verifyUser` (quando precisa de auth): `backend/src/core/auth.ts` (lê `x-access-token`, injeta `req.user`).

### Frontend
- Login: `frontend/src/pages/Login.tsx`
  - Usa `useAuth().login(email, password)` (implementado no `AuthContext.tsx`).
  - Ao sucesso, navega e mantém `token`/`user` em storage/contexto.
- Registro: `frontend/src/pages/Register.tsx`
  - Envia POST para `/api/auth/register` e, em alguns fluxos, já autentica em seguida.

Fluxo (login):
1. Componente envia POST `/api/auth/login`.
2. Backend valida e responde com `{ token, user }`.
3. `AuthContext` persiste `token` e `user`, UI redireciona.

---

## Users – Perfil (Meus dados) e Troca de Senha

### Backend
- Rotas de perfil e admin: `backend/src/users-profile/routes.ts`
  - `GET /api/users/me` → `getMe` (`backend/src/users/controller.ts`)
  - `PATCH /api/users/me` + `validateBody(profileUpdateSchema)` → `updateMe`
  - `POST /api/users/me/change-password` + `validateBody(changePasswordSchema)` → `changeMyPassword`
- Schemas: `backend/src/validation/users.schemas.ts`
- Controller: `backend/src/users/controller.ts` (regras de negócios, respostas)
- Model (acesso a dados, quando aplicável): `backend/src/users/model.ts`

Fluxo (atualizar perfil):
1. Frontend envia `PATCH /api/users/me` com `x-access-token`.
2. Middlewares: `verifyUser` → `validateBody(profileUpdateSchema)`.
3. Controller `updateMe` aplica regras (ex.: senha atual obrigatória se mudar e-mail), chama model/Prisma.
4. Resposta via `sendSuccess` com dados atualizados.

Fluxo (trocar senha do próprio usuário):
1. Frontend envia `POST /api/users/me/change-password` com payload (senha atual, nova, confirmação).
2. Middlewares: `verifyUser` → `validateBody(changePasswordSchema)`.
3. Controller `changeMyPassword` valida senha atual, gera hash novo, salva.
4. Resposta de sucesso e UI mostra toast.

### Frontend
- Página: `frontend/src/pages/Profile.tsx`
  - Usa `useAuth()` para `updateProfile` e `changePassword`.
  - Renderiza formulário e modal de troca de senha.

---

## Admin – Usuários (Listar, Alterar Role, Resetar Senha, Excluir)

### Backend
- Rotas admin (mesmo arquivo de perfil): `backend/src/users-profile/routes.ts`
  - `GET /api/users` → `adminListUsers`
  - `PATCH /api/users/:id/role` (ROOT) → `adminSetRole`
  - `POST /api/users/:id/password` (ADMIN/ROOT) → `adminResetPassword`
  - `PATCH /api/users/:id/password` (compatibilidade) → `adminResetPassword`
  - `DELETE /api/users/:id` (ADMIN/ROOT) → `adminDeleteUser` (soft delete)
- Controller: `backend/src/users/controller.ts`
  - Validações adicionais (ex.: impedir alterar a si mesmo, impedir desativar a si mesmo, etc.).
- Schemas: `backend/src/validation/users.schemas.ts` (role e senha admin)

Fluxos principais:
- Listar usuários:
  1. Frontend envia `GET /api/users` com token.
  2. Middlewares: `verifyUser` + `isAdmin`.
  3. Controller `adminListUsers` consulta Prisma (com paginação simples) e retorna.
- Alterar role:
  1. `PATCH /api/users/:id/role` (ROOT) com `{ role }`.
  2. `verifyUser` + `isRoot` → `adminSetRole` → Prisma → sucesso.
- Resetar senha (admin):
  1. `POST /api/users/:id/password` com `{ password }`.
  2. `verifyUser` + `isAdmin` → hash e update via Prisma → sucesso.
- Excluir (soft delete):
  1. `DELETE /api/users/:id`.
  2. `verifyUser` + `isAdmin` → marca `deleted_at`/inativo → responde `204`.

### Frontend
- Página: `frontend/src/pages/admin/AdminUsers.tsx`
  - Carrega lista (`GET /api/users`).
  - Altera role (select → `PATCH /api/users/:id/role`).
  - Reset de senha (modal → `POST /api/users/:id/password`).
  - Exclusão (botão → `DELETE /api/users/:id`); trata `204 No Content` e atualiza a lista no estado local.

---

## Menu – Categorias e Itens (CRUD de Itens, Lista Pública)

### Backend
- Rotas: `backend/src/menu/routes.ts`
  - Público: `GET /api/menu` → `getMenu` (lista categorias + itens ativos)
  - Admin:
    - `POST /api/menu/items` + `validateBody(createItemSchema)` → `createMenuItem`
    - `PATCH /api/menu/items/:id` + `validateBody(updateItemSchema)` → `patchMenuItem`
    - `DELETE /api/menu/items/:id` → `deleteMenuItem`
- Schemas: `backend/src/validation/menu.schemas.ts`
- Controller: `backend/src/menu/controller.ts`
- Model: `backend/src/menu/model.ts`

Fluxo (criar item):
1. Frontend admin envia `POST /api/menu/items` com token.
2. Middlewares: `verifyUser` → `isAdmin` → `validateBody(createItemSchema)`.
3. Controller chama Prisma para inserir, padroniza resposta.
4. Frontend atualiza grid/lista e mostra toast.

Fluxo (listar público):
1. Frontend envia `GET /api/menu` (sem token).
2. Controller monta `CategoryWithItems` ativos e responde.

### Frontend
- Página pública: `frontend/src/pages/Menu.tsx`
  - Busca categorias/itens; integra com carrinho (`CartContext`).
  - Checkout envia pedido em `/api/orders` (ver seção Pedidos).
- Página admin (cardápio): `frontend/src/pages/admin/AdminMenu.tsx`
  - CRUD de itens com os endpoints admin acima.

---

## Pedidos – Cliente (Criar e Listar)

### Backend
- Rotas: `backend/src/orders/routes.ts` (montado em `backend/src/routes/index.ts` em `/api/orders`)
  - `GET /api/orders` → `listMyOrders` (`backend/src/orders/controller.ts`)
  - `POST /api/orders` + `validateBody(createOrderSchema)` → `createOrder`
- Schemas: `backend/src/validation/orders.schemas.ts`
- Controller: `backend/src/orders/controller.ts`
- Model: `backend/src/orders/model.ts`

Fluxo (criar pedido):
1. Frontend envia `POST /api/orders` com `{ tableNumber, paymentMethod, items[] }` e token.
2. Middlewares: `verifyUser` → `validateBody(createOrderSchema)`.
3. Controller valida itens ativos via `findActiveItemsByIds`, calcula subtotal/tax/total, chama `createOrderWithItems`.
4. Resposta `201` com dados do pedido; frontend limpa carrinho e pode redirecionar.

Fluxo (listar meus pedidos):
1. `GET /api/orders` com token.
2. Controller `listMyOrders` busca pelo `userId` e retorna lista.

### Frontend
- Checkout e criação: `frontend/src/pages/Menu.tsx` (botão “Finalizar Pedido”).
- Listagem: `frontend/src/pages/MyOrders.tsx` (lista pedidos do usuário logado).

---

## Pedidos – Admin (Listar, Atualizar Status, Cancelar)

### Backend
- Rotas: `backend/src/routes/admin.orders.routes.ts` (montado em `/api/admin/orders`)
  - `GET /api/admin/orders` → lista pedidos com usuário e itens
  - `PATCH /api/admin/orders/:id/status` + `validateBody(setStatusSchema)` → atualiza status (`PENDENTE|PREPARANDO|PRONTO|ENTREGUE|CANCELADO`)
  - `DELETE /api/admin/orders/:id` → cancela/desativa
- Schema de status: `backend/src/validation/admin.schemas.ts`

Fluxos:
- Lista admin:
  1. `GET /api/admin/orders` com token (ADMIN/ROOT).
  2. Controller agrega user + items e responde.
- Atualizar status:
  1. `PATCH /api/admin/orders/:id/status` com `{ status }` válido.
  2. Middlewares: `verifyUser` + `isAdmin` → validação → update e resposta.
- Cancelar pedido:
  1. `DELETE /api/admin/orders/:id`.
  2. Marca como cancelado/soft delete e responde (geralmente `204`).

### Frontend
- Página: `frontend/src/pages/admin/AdminOrders.tsx`
  - Renderiza pedidos, permite alterar status e cancelar.

---

## Middlewares, Respostas e Erros (Comuns a Todos os Fluxos)
- `verifyUser`/`isAdmin`/`isRoot`: `backend/src/core/auth.ts` (usa `core/jwt.ts`)
- `validateBody(schema)`: `backend/src/core/validate.ts` (monta `errors` amigáveis)
- Respostas padrão: `backend/src/core/responses.ts`
  - Sucesso com dados: `sendSuccess(res, data[, status])`
  - Sucesso com texto: `sendMessage(res, message[, status])`
  - Erro: `sendError(res, message[, status, details])`
  - Validação: `sendValidationError(res, errors[, message])`
- Tratamento global: `backend/src/core/errorHandler.ts`

---

## Como a Requisição trafega (Resumo)
1. Frontend dispara fetch/axios para `/api/...` (Vite proxy encaminha para o backend).
2. Express casa a rota → aplica middlewares (auth, validação, roles).
3. Controller executa regra de negócio e chama Model/Prisma.
4. Resposta padronizada `{ ok: true|false, data|message|errors }`.
5. Frontend interpreta, atualiza estado (contexts/páginas) e exibe toasts.

---

## Exemplos Rápidos (curl)
- Login: `POST /api/auth/login`
```bash
curl -s -X POST http://localhost:3333/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"root@uaifood.com","password":"root123"}'
```
- Criar item (admin): `POST /api/menu/items`
```bash
curl -s -X POST http://localhost:3333/api/menu/items \
  -H 'Content-Type: application/json' -H "x-access-token: $TOKEN" \
  -d '{"name":"Novo Prato","price":25.9,"categoryId":"<CATEGORY_ID>"}'
```
- Criar pedido: `POST /api/orders`
```bash
curl -s -X POST http://localhost:3333/api/orders \
  -H 'Content-Type: application/json' -H "x-access-token: $TOKEN" \
  -d '{"tableNumber":"3","paymentMethod":"PIX","items":[{"itemId":"seed-pratos-1","quantity":2}]}'
```

---

## Onde Ajustar Cada Coisa
- Adicionar/alterar validações: `backend/src/validation/*.schemas.ts`
- Trocar regras de negócio: `backend/src/*/controller.ts`
- Otimizar queries: `backend/src/*/model.ts` e `backend/prisma/schema.prisma`
- Proteger novas rotas: `backend/src/core/auth.ts` (roles) + uso nas rotas
- Exibir/consumir no front: páginas em `frontend/src/pages/*` e contexts em `frontend/src/contexts/*`

---

## Dicas de Debug
- Ver payloads inválidos: olhar `errors` (Zod) na resposta e o log do backend (morgan/pino).
- 401/403: conferir `x-access-token` e roles (`isAdmin`/`isRoot`).
- 204 No Content: não tente `res.json()` no front; trate o status.
- Swagger em `/docs`: checar contratos rapidamente.

---

Pronto! Este guia cobre os fluxos CRUD principais (Auth, Users, Menu, Orders) de ponta a ponta. Use os caminhos informados para navegar o código e evoluir com segurança.
