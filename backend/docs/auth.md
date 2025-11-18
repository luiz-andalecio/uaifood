# Autenticação da UAIFood API

A UAIFood API utiliza JWT para autenticação. Você pode enviar o token por dois headers diferentes:

- Preferencial: `Authorization: Bearer <token>`
- Compatível: `x-access-token: <token>` (padrão do exemplo jwt-example)

Obtendo o token:
1. Faça login em `POST /api/auth/login` com seu email e senha.
2. A resposta conterá `token` e `user`.

Exemplos de uso

```bash
# Authorization Bearer (preferencial)
curl -s \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3333/api/users/me

# x-access-token (compatível)
curl -s \
  -H "x-access-token: $TOKEN" \
  http://localhost:3333/api/users/me
```

Em ferramentas como Postman:
- Configure uma variável `token` no ambiente com o valor do JWT retornado.
- Em requisições protegidas, adicione o header `x-access-token: {{token}}` ou `Authorization: Bearer {{token}}`.

No frontend:
- O contexto de autenticação (`frontend/src/contexts/AuthContext.tsx`) guarda `token` após o login.
- As páginas protegidas (ex.: Perfil, Pedidos) usam `ProtectedRoute` para exigir login.
- As chamadas a `/api/*` podem enviar automaticamente `Authorization: Bearer <token>` através de interceptors do axios ou manualmente, por exemplo:

```ts
import axios from 'axios'
const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uaifood_token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})
```

Observações
- Tokens expiram; faça login novamente caso receba 401.
- Usuários ADMIN/ROOT têm acesso a rotas administrativas (`/api/admin/*`).
- Em desenvolvimento, você pode usar o usuario `root@uaifood.com` (seed) para testar permissões.
