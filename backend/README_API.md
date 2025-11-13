# UAIFood API – Endpoints

Documentação resumida dos endpoints (detalhes completos e exemplos em `/docs`).

## Autenticação (Auth)
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| POST | /api/auth/register | Cria usuário cliente | Não |
| POST | /api/auth/login | Autentica e retorna JWT | Não |

## Menu
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | /api/menu | Lista categorias e itens ativos | Não |
| POST | /api/menu/items | Cria item | Bearer (ADMIN/ROOT) |
| PATCH | /api/menu/items/{id} | Atualiza item | Bearer (ADMIN/ROOT) |
| DELETE | /api/menu/items/{id} | Remove item (soft) | Bearer (ADMIN/ROOT) |

## Usuário (Perfil / Administração)
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | /api/users/me | Dados do usuário logado | Bearer |
| PATCH | /api/users/me | Atualiza dados básicos | Bearer |
| POST | /api/users/me/change-password | Troca senha própria | Bearer |
| GET | /api/users | Lista usuários (admin/root) | Bearer (ADMIN/ROOT) |
| PATCH | /api/users/{id}/role | Altera role (root) | Bearer (ROOT) |
| POST | /api/users/{id}/password | Redefine senha do usuário | Bearer (ADMIN/ROOT) |
| DELETE | /api/users/{id} | Desativa usuário | Bearer (ADMIN/ROOT) |

## Pedidos (Cliente)
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | /api/orders | Lista pedidos do usuário | Bearer |
| POST | /api/orders | Cria pedido (mesa obrigatória) | Bearer |

## Administração (Pedidos / Dashboard)
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | /api/admin/dashboard | Métricas gerais | Bearer (ADMIN/ROOT) |
| GET | /api/admin/orders | Lista pedidos com filtros | Bearer (ADMIN/ROOT) |
| PATCH | /api/admin/orders/{id}/status | Atualiza status | Bearer (ADMIN/ROOT) |
| DELETE | /api/admin/orders/{id} | Cancela pedido | Bearer (ADMIN/ROOT) |

## Esquema de Erro Padrão
Todas as respostas de erro retornam:
```json
{ "message": "Descrição do erro" }
```

## Segurança
Enviar header:
```
Authorization: Bearer <JWT>
```

### Notas de implementação
- Config de ambiente centralizada em `src/config/env.ts` (carrega `.env`, define `PORT` e `JWT_SECRET`).
- Assinatura/validação de JWT em `src/core/jwt.ts` (payload tipado, expiração padrão 7d).
- Middlewares enxutos em `src/middlewares/` (`auth.ts` e `error.ts`).
- Rotas mantidas simples e objetivas, com mensagens de erro claras em português.

### NextSteps:
Aproxime ainda mais algum ponto do estilo do jwt-example (exemplo: estrutura de pastas, uso de Sequelize, handlers de resposta, etc.)
Adicionar um logger leve (pino) no errorHandler.
Padronizar respostas de validação com um helper.
Adicionar validação de schema (ex.: zod) nas rotas de entrada mais sensíveis sem “pesar” o código.
Atualizar o Swagger para refletir todos os endpoints de perfil/usuários que já existem (ex.: /users/me/change-password).
Atualizo a documentação Swagger com os exemplos de payload após normalização de email.
Adiciono validação leve com zod só nos endpoints de auth (mantendo o resto simples).
Integro um logger não-verboso no handler de erros.

Aqui estão pontos do jwt-example que podem ser aplicados para deixar o projeto UAIFood ainda mais humano, organizado e didático:

Backend
Estrutura de Pastas Modular

Separar controllers, models, routes, core, configs (como no jwt-example).
Exemplo: mover lógica de cada rota para um controller (ex: src/user/controller.ts), deixando as rotas só como “ponte”.
Controllers e Models

Criar controllers para cada recurso (user, profile, menu, order), facilitando testes e manutenção.
Models podem ser mantidos no Prisma, mas controllers ajudam a separar regras de negócio.
Helpers de Resposta

Criar helpers para respostas padronizadas (ex: sendSuccess, sendError), evitando repetição de res.status().json().
Validação de Dados

Usar uma lib como Zod ou Joi para validar body/query params nas rotas (como o jwt-example faz com schemas).
Exemplo: validar email/senha antes de criar usuário.
Logger Simples

Adicionar um logger leve (ex: pino, winston) para registrar erros e ações importantes.
Configuração Centralizada

Já foi feito com env.ts, mas pode expandir para configs de database, CORS, etc.
Documentação de Rotas

Adicionar exemplos de uso (payloads) nos arquivos de rota ou controllers, como comentários.
Testes Automatizados

Adicionar testes de integração para rotas principais usando Jest ou Vitest.
Padronização de Mensagens

Usar helpers para mensagens de erro e sucesso, mantendo consistência.
Exemplo de Postman

Gerar uma coleção Postman para facilitar testes manuais (como o exemplo.postman_collection).
Frontend
Separação de Contextos e Hooks

Manter contextos (Auth, Cart) em src/contexts/ e criar hooks customizados para lógica de autenticação.
Componentização

Manter componentes pequenos e reutilizáveis, como no exemplo.
Validação de Formulários

Usar libs como Zod ou Yup para validar dados do usuário no frontend.
Padronização de Mensagens

Centralizar mensagens de erro/sucesso em um provider (ex: ToastProvider).
Exemplo de Consumo de API

Adicionar exemplos de requisições (fetch/axios) em comentários ou docs.
Documentação de Fluxo

Documentar o fluxo de login, registro e uso do JWT no frontend (como o token é armazenado, renovado, etc).

## Exemplos Rápidos
### Login
```json
POST /api/auth/login
{ "email": "root@uaifood.com", "password": "root" }
```
### Criar Pedido
```json
POST /api/orders
{
  "tableNumber": "7",
  "paymentMethod": "PIX",
  "items": [
    { "itemId": "it-coca", "quantity": 2 },
    { "itemId": "it-burguer", "quantity": 1 }
  ]
}
```

## Observações
- Campo `mesa` (tableNumber) é obrigatório ao criar pedidos (atribuído no frontend se vazio).
- Remoção de itens e usuários é soft delete (mantém histórico). 
- Para mais detalhes (schemas, exemplos de respostas), acesse `/docs` após subir o backend.

---

Atualizações recentes:
- Simplificação e centralização de JWT/ENV conforme boas práticas do exemplo `jwt-example`, mantendo Prisma e Express.
