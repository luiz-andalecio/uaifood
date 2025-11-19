# UAIFood – Roteiro Completo de Apresentação

> Objetivo: Apresentar toda a estrutura do projeto (backend + frontend), demonstrar fluxos principais (autenticação, criação de usuário, item, pedido, perfil), esquema de mensagens / erros, testes de API e análise crítica final.

---
## 1. Organização do Back-end

Estrutura principal em `backend/src/` dividida por responsabilidades:

| Pasta / Arquivo            | Função                                                                                         |
|----------------------------|--------------------------------------------------------------------------------------------------|
| `server.ts`                | Inicializa Express, middlewares globais, Swagger, roteador raiz `/api`.                        |
| `config/`                  | Variáveis de ambiente e configuração (ex: `env`).                                               |
| `core/`                    | Núcleo reutilizável: autenticação (`auth.ts`), JWT (`jwt.ts`), validação (`validate.ts`), logger, respostas padronizadas (`responses.ts`), handler global de erros (`errorHandler.ts`). |
| `routes/`                  | Roteador raiz (`index.ts`) e rotas auxiliares administrativas (ex: métricas, pedidos admin).   |
| `menu/`                    | Domínio de cardápio: `routes.ts`, `controller.ts`, `model.ts`.                                  |
| `orders/`                  | Domínio de pedidos: `routes.ts`, `controller.ts`, `model.ts`.                                   |
| `users-profile/`           | Rotas de perfil e administração de usuários.                                                    |
| `users/`                   | Controladores auxiliares para operações de usuário (chamados por `users-profile/routes.ts`).   |
| `validation/`              | Schemas Zod para validar payloads de entrada (auth, menu, orders, users).                      |
| `prisma/`                  | `schema.prisma` + migrations.                                                                  |
| `seed.ts`                  | Script para popular base (Root + categorias + itens).                                          |
| `swagger/` ou `swagger.yaml` | Documentação OpenAPI carregada dinamicamente.                                                 |
| `types/`                   | Tipos auxiliares para reforçar segurança de dados.                                             |

### Middlewares Globais (em `server.ts`)
- `helmet`, `cors`, `express.json`, `morgan('dev')`.
- Carregamento dinâmico da documentação Swagger (multi-arquivos ou arquivo único).
- Rota de saúde `/health`.

### Autenticação
- Tokens JWT são emitidos em `/api/auth/login` (arquivo `auth.routes.ts`).
- Cabeçalho customizado no frontend/back-end: `x-access-token`.
- Middleware de verificação (em `core/auth.ts`) injeta `req.user` quando válido.

### Padronização de Respostas (`core/responses.ts`)
Todas as respostas seguem envelope:
```json
{ "ok": true, "data": { ... } }
{ "ok": true, "message": "..." }
{ "ok": false, "message": "Erro ..." }
```
Erros de validação podem incluir `errors: [ { field, message } ]`.

---
## 2. Organização do Schema de Dados (Prisma)
Arquivo: `backend/prisma/schema.prisma`

Principais elementos:
- Enums: `UserRole`, `PaymentMethod`, `OrderStatus` – reforçam integridade sem números mágicos.
- Modelos:
  - `User`: dados de autenticação + relacionamento `orders`.
  - `Category`: agrupador de itens de menu.
  - `Item`: pertence a uma `Category`, pode ser marcado como inativo / soft delete.
  - `Order`: referência ao usuário e compõe vários `OrderItem`.
  - `OrderItem`: itens do pedido com preço unitário e total congelados no momento da compra.

Relações:
- `User (1) -> (n) Order`
- `Category (1) -> (n) Item`
- `Order (1) -> (n) OrderItem`
- `Item (1) -> (n) OrderItem`

Decisões:
- Uso de `Decimal` para valores monetários evitando float impreciso.
- Campos de auditoria: `created_at`, `updated_at`, `deleted_at` (soft delete em `Item`/`User`).
- `table_number` no `Order` permite associação a mesas físicas (ver seção de mesas).

---
## 3. Organização dos Controladores (Controllers)
Cada domínio tem `controller.ts` + `model.ts`:
- `orders/controller.ts`: regras para criação e listagem do pedido do usuário autenticado (cálculo subtotal/tax/total e validação itens).
- `menu/controller.ts`: montagem do cardápio agrupado por categorias + CRUD de itens (admin).
- `users/controller.ts` (referenciado dentro de `users-profile/routes.ts`): obter perfil, atualizar perfil, trocar senha, rotas administrativas (alterar role, resetar senha, desativar).

Os controllers:
1. Validam dados via schemas Zod (`validation/*.schemas`).
2. Chamam funções de dados em `model.ts` para encapsular queries Prisma.
3. Retornam envelope padronizado usando `sendSuccess` / `sendError`.

Fluxo padrão de uma rota protegida:
```
[Request] -> verifyUser (decodifica JWT) -> validateBody (Zod) -> controller (regra de negócio) -> sendSuccess/sendError
```

---
## 4. Organização das Rotas
`routes/index.ts` reúne e monta sub-routers em `/api`:
- `/api/auth` – autenticação (`login`, `register`).
- `/api/users` – perfil e administração de usuários.
- `/api/menu` – listagem pública + CRUD de itens (admin).
- `/api/orders` – criação/listagem de pedidos do usuário.
- `/api/admin/*` – rotas adicionais de administração (ex: métricas, pedidos administrados).

Separação promove clareza por domínio e facilita versionamento futuro (`/api/v2`).

---
## 5. Bibliotecas Usadas
### Backend
- `express`, `cors`, `helmet`, `morgan` – base web + segurança + logging.
- `prisma` / `@prisma/client` – ORM tipado para Postgres.
- `bcryptjs` – hash de senhas.
- `jsonwebtoken` – tokens JWT (via helper `core/jwt.ts`).
- `zod` – validação de entrada (`validation/*`).
- `swagger-ui-express`, `yaml` – documentação OpenAPI.
- `openapi-types` – tipagem do documento Swagger.
- Utilitárias: `dotenv`, `fs`, `path`.

### Frontend
- `react`, `react-dom`, `react-router-dom` – SPA.
- `vite` – bundler/dev server.
- `tailwindcss`, `postcss` – estilização utilitária.
- Ícones: `lucide-react`.
- Contextos customizados: Auth, Cart, Toast.

---
## 6. Teste da Aplicação (Roteiro API – via curl/Postman)
> Base URL backend: `http://localhost:3333/api`

### 6.1 Login (usuário ROOT de seed)
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"root@uaifood.com","password":"root123"}'
```
Resposta (exemplo):
```json
{ "ok": true, "data": { "token": "<JWT>", "user": { "id": "...", "role": "ROOT" } } }
```

### 6.2 Criar Usuário
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Cliente","email":"cliente@teste.com","password":"minhasenha", "phone":"319999999"}'
```

### 6.3 Obter Perfil
```bash
curl http://localhost:3333/api/users/me -H "x-access-token: <JWT>"
```

### 6.4 Listar Cardápio Público
```bash
curl http://localhost:3333/api/menu
```

### 6.5 Criar Item (ADMIN/ROOT)
```bash
curl -X POST http://localhost:3333/api/menu/items \
  -H 'Content-Type: application/json' -H "x-access-token: <JWT>" \
  -d '{"name":"Novo Prato","price":25.90,"categoryId":"<CATEGORY_ID>"}'
```

### 6.6 Criar Pedido
```bash
curl -X POST http://localhost:3333/api/orders \
  -H 'Content-Type: application/json' -H "x-access-token: <JWT>" \
  -d '{"tableNumber":"3","paymentMethod":"PIX","items":[{"itemId":"seed-pratos-1","quantity":2}]}'
```

### 6.7 Listar Meus Pedidos
```bash
curl http://localhost:3333/api/orders -H "x-access-token: <JWT>"
```

### 6.8 Erro Forçado (Pedido com item inválido)
```bash
curl -X POST http://localhost:3333/api/orders \
  -H 'Content-Type: application/json' -H "x-access-token: <JWT>" \
  -d '{"tableNumber":"2","paymentMethod":"PIX","items":[{"itemId":"inexistente","quantity":1}]}'
```
Resposta:
```json
{ "ok": false, "message": "Itens inválidos ou inativos." }
```

### 6.9 Acesso Protegido sem Token
```bash
curl http://localhost:3333/api/orders
```
Resposta:
```json
{ "ok": false, "message": "Não autenticado." }
```

---
## 7. Apresentação do Front-end

### Tecnologia
- SPA em React + Vite para desenvolvimento rápido (hot reload). Tailwind para produtividade em UI.

### Organização
| Pasta | Função |
|-------|--------|
| `src/App.tsx` | Composição de rotas/estrutura principal. |
| `src/main.tsx` | Entrada Vite + Providers globais. |
| `src/contexts/` | Contextos (Auth, Cart, Toast). Compartilham estado entre páginas. |
| `src/pages/` | Páginas de alto nível (Login, Menu, Register, MyOrders, Profile, admin/*). |
| `src/components/` | Componentes reutilizáveis (Navbar, Footer, Toasts, etc.). |
| `src/types/` | Tipos compartilhados para garantir consistência com backend. |
| `styles.css` | Estilos globais Tailwind / overrides. |

### Estratégia de Organização de Mesas
- No arquivo `Menu.tsx`: mesa (`tableNumber`) gerada aleatoriamente 1..12 e persistida em `sessionStorage` (`uaifood_table_number`). Simula tablets fixos por mesa sem exigir login prévio.

### Criação de Pedido (Fluxo UI)
1. Usuário adiciona itens via botão “Adicionar”.
2. Carrinho à direita acumula itens e quantidades.
3. Ao clicar “Finalizar Pedido”: POST `/api/orders` com `tableNumber`, `paymentMethod`, `items`.
4. Sucesso: carrinho esvazia e redireciona para “Meus Pedidos”.

### Criação de Item (Admin)
1. Admin autenticado acessa página de administração (`AdminMenu.tsx`).
2. Formulário envia POST `/api/menu/items` com token (cabeçalho `x-access-token`).

### Criação de Usuário
- Página `Register.tsx` envia POST `/api/auth/register`. Em seguida o usuário pode fazer login.

### Logout & Rotas Protegidas
- Contexto Auth remove token e estado. Ao acessar página protegida (ex: `MyOrders`) sem token, UI exibe mensagem de necessidade de login.
- Requisições sem token recebem `{ ok: false, message: "Não autenticado." }` do backend.

### Perfil de Usuário
- Página `Profile.tsx` (ou fluxo similar) usa rotas: GET `/api/users/me`; PATCH `/api/users/me`; POST `/api/users/me/change-password`.
- Atualizações exigem token e podem retornar erro de validação (ex: senha atual incorreta).

### Mensagens de Sucesso/Erro
- Camada de UI usa provider de Toast (`useToast`) exibindo `toast.success`, `toast.error`, etc.
- Backend sempre devolve envelope previsível. Front-end desestrutura `json.data` ou `json.message`.

### Forçando um Erro (Demo UI)
- Tentar finalizar pedido com carrinho vazio → toast informativo.
- Ou alterar código para enviar item inexistente → backend retorna `ok:false` e front exibe toast de erro.

---
## 8. Esquema de Mensagens & Tratamento de Erros
Padrão unificado simplifica parsing:
- Sucesso com dados: `{ ok: true, data: {...} }`.
- Sucesso com texto: `{ ok: true, message: "..." }`.
- Erro genérico: `{ ok: false, message: "..." }`.
- Erro de validação: `{ ok: false, message: "Dados inválidos.", errors: [{ field, message }] }`.

Benefícios:
- Front-end pode verificar `if (!json.ok)` para fluxo de erro.
- Evita condicionais diferentes por rota.

---
## 9. Demonstração de Erro (Forçado)
Exemplo: criar pedido com item inválido.
Resposta prevista:
```json
{ "ok": false, "message": "Itens inválidos ou inativos." }
```
A UI exibe toast de erro com `message`.

---
## 10. Pontos Fortes
- Separação de domínios clara (`menu`, `orders`, `users`).
- Schema Prisma robusto, enums para estados importantes.
- Resposta uniforme simplifica integração front-end.
- Uso de Zod → falhas de validação padronizadas.
- Context API no React facilita compartilhamento (auth, cart). Mesa simulada elegante via `sessionStorage`.
- Pedido calcula subtotal/tax/total de forma previsível.
- Swagger integrado (documentação acessível). 

## 11. Pontos a Melhorar
- Adicionar testes automatizados (unit/integration) para controllers e validações.
- Implementar paginação/filtragem avançada em listagens de itens e pedidos.
- Adicionar refresh de token / expiração explícita.
- Melhorar segurança: rate limiting, política de senha mais forte.
- Internacionalização (i18n) para mensagens.
- Camada de cache (ex: categorias) para reduzir carga de leitura.
- Logs estruturados com traço de correlação por requisição.
- Mecanismo de roles mais granular (permissões por ação). 
- Mensagens de erro mais explícitas para usuário final em alguns fluxos.

---
## 12. Roteiro de Apresentação (Passo a Passo)
1. Mostrar estrutura de pastas backend e explicar cada camada.
2. Exibir `schema.prisma` destacando relações e enums.
3. Abrir `auth.routes.ts` e mostrar login + envelope de resposta.
4. Abrir `orders/controller.ts` para explicar cálculo de pedido.
5. Mostrar `responses.ts` – padrão de retorno.
6. Exibir trecho de `Menu.tsx` (mesa + carrinho + finalizeOrder).
7. Demo via curl: login, registrar usuário, listar cardápio, criar item (admin), criar pedido.
8. Demo rota protegida sem token (falha).
9. Demo atualização de perfil e troca de senha.
10. Forçar erro (item inexistente) e exibir resposta.
11. Concluir com análise de pontos fortes e melhorias.

---
## 13. Referências Cruzadas Rápidas
| Domínio | Rota Principal | Controller | Model |
|---------|----------------|-----------|-------|
| Auth    | `/api/auth/*`  | `auth.routes.ts` (inline) | N/A direto (usa Prisma direto) |
| Menu    | `/api/menu/*`  | `menu/controller.ts` | `menu/model.ts` |
| Orders  | `/api/orders/*`| `orders/controller.ts` | `orders/model.ts` |
| Users   | `/api/users/*` | `users/controller.ts` | `users/model.ts` (se existir) |

---
## 14. Observações Finais
Este roteiro cobre estado ATUAL do projeto após ajustes recentes (header `x-access-token` + parsing `json.data`). Segue preparado para evolução incremental com testes e otimizações.

---
_Fim do roteiro._
