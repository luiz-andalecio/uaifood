# UAIFood API – Endpoints

> 📖 Veja instruções detalhadas de autenticação em [docs/auth.md](docs/auth.md)
> 🧭 Visão geral completa (backend/frontend): [docs/overview.md](docs/overview.md)

Documentação OpenAPI (Swagger) modular:
- Os arquivos da especificação agora estão em `src/swagger/` (com `index.yaml`, `components/` e `paths/`).
- A UI está disponível em `/docs` quando o backend está rodando.

> 📚 Guia completo do Swagger: [docs/swagger.md](docs/swagger.md)

Documentação resumida dos endpoints (detalhes completos e exemplos em `/docs`).

## Autenticação (Auth)
| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| POST | /api/auth/register | Cria usuário cliente | Não |
| POST | /api/auth/login | Autentica e retorna JWT | Não |

Observações de headers de autenticação:
- Preferencial: `Authorization: Bearer <token>`
- Alternativo: `x-access-token: <token>`
  - Ambos aceitos para facilitar testes.

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
- Middlewares enxutos em `src/core/` (`auth.ts` e `errorHandler.ts`).
- Rotas mantidas simples e objetivas, com mensagens de erro claras em português.

### Ideias de evolução
- Logger estruturado mais detalhado.
- Testes de integração e cobertura básica.
- Controllers uniformes para todos os domínios.
- Cache simples para o menu público.
- Paginação e filtros mais ricos nas listagens.
- Regras extras de validação (senha forte, formatos de telefone/endereço).

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
- Centralização de JWT/ENV.
- Validações com Zod extraídas para pastas próprias.
- Padronização de respostas (ok/data/message).
