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
