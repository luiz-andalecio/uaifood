# UAIFood Backend – Guia de Arquitetura Modular

Este documento explica o padrão modular adotado (inspirado no `jwt-example`) para deixar o código mais humano, didático e fácil de evoluir.

## Objetivos
1. Separar responsabilidades claramente: rotas, controllers e modelos de acesso a dados.
2. Reduzir redundância de lógica e facilitar testes unitários/integrados.
3. Padronizar respostas e validações.
4. Manter baixo acoplamento e alta legibilidade.

## Camadas
| Camada | Pasta | Responsabilidade |
|--------|-------|------------------|
| Rotas | `src/routes/*` | Declaram endpoints, aplicam middlewares e chamam controllers. |
| Controllers | `src/{dominio}/controller.ts` | Orquestram regras de negócio, validam premissas, chamam modelos e retornam via helpers. |
| Models | `src/{dominio}/model.ts` | Funções puras de acesso a dados (Prisma). |
| Core | `src/core/*` | Infraestrutura e utilidades (JWT, logger, prisma, responses, validate). |
| Validation | `src/validation/*` | Schemas Zod reutilizáveis (corpos de requisição). |

## Fluxo de uma requisição
1. Chega em `routes/*.ts` (ex: `routes/auth.routes.ts`).
2. Middleware de auth (quando necessário) valida JWT e injeta `req.user`.
3. Middleware `validateBody(schema)` aplica Zod nos dados de entrada.
4. Controller (ex: `users/controller.ts`) executa lógica e chama funções de model.
5. Resposta padronizada via `sendSuccess` ou `sendError`.

## Helpers Padronizados
Local: `src/core/responses.ts`
```ts
sendSuccess(res, data, status?)
sendError(res, message, status?, details?)
sendValidationError(res, errors, message?)
```
Motivos: evita repetição de `res.status(...).json(...)` e mantém formato consistente para o frontend.

## Validação
Middlewares Zod em `src/validation/*.ts` centralizam schemas. Exemplo:
```ts
export const loginSchema = z.object({
  email: z.string().email().transform(v => v.trim().toLowerCase()),
  password: z.string().min(1)
})
```
Uso na rota:
```ts
router.post('/login', validateBody(loginSchema), authLoginController)
```

## Autenticação / Autorização
Middlewares em `src/core/auth.ts`:
- `verifyUser` – lê `x-access-token` e valida o JWT.
- `isAdmin` / `isRoot` – verificação de roles.

## Padrão de Nomeação
| Tipo | Padrão |
|------|--------|
| Rota | `*.routes.ts` |
| Controller | `controller.ts` |
| Model | `model.ts` |
| Schema Zod | `*.schema.ts` |

## Testes (Planejado)
Serão adicionados em `src/tests/` usando Vitest + supertest:
- Auth: registro e login
- Menu: criação de item admin
- Orders: criação de pedido autenticado

## Boas Práticas Seguidas
- Uso de Prisma singleton (`core/prisma.ts`) para evitar múltiplas conexões.
- Lógica complexa fora das rotas.
- Funções pequenas e focadas.
- Comentários em português claros e diretos.

## Próximos Passos
- Adicionar testes automatizados.
- Revisar e podar schemas Swagger não usados.
- Adicionar coleção Postman gerada automaticamente para facilitar QA.

---
Qualquer nova funcionalidade deve seguir este fluxo: Rota → Controller → Model → Responses.
