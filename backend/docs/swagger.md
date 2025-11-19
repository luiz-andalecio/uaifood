# Guia do Swagger/OpenAPI da UAIFood API

Este guia explica o que é Swagger/OpenAPI, para que serve, como está configurado no projeto UAIFood e como você pode testar os endpoints diretamente pela interface do Swagger UI e via curl.

## O que é Swagger / OpenAPI
- **OpenAPI**: Especificação padronizada para descrever APIs HTTP (endpoints, parâmetros, schemas, respostas, segurança, etc.).
- **Swagger**: Conjunto de ferramentas (inclui Swagger UI) para visualizar e interagir com especificações OpenAPI.
- **Benefícios**: Documentação viva, padronização, “Try it out” para testes, base para geração de SDKs/clientes e contratos estáveis entre times.

## Como está no projeto
- **Versão**: OpenAPI `3.0.3`.
- **UI**: Servida pelo backend em `http://localhost:3333/docs`.
- **Especificação multi-arquivos** (modular):
  - Arquivo raiz: `backend/src/swagger/index.yaml`.
  - Componentes e paths em subpastas para ficar simples de manter.
  - A UI consome `/docs-spec/index.yaml` diretamente.
  - `/docs.json` devolve o documento raiz sem resolver as refs.
- **Estrutura**:
  ```
  backend/src/swagger/
    index.yaml                 # OpenAPI raiz
    components/
      security.yaml            # Esquema de segurança (xAccessToken)
      schemas.yaml             # Schemas (User, Item, Order, Error, etc.)
      responses.yaml           # Respostas comuns (Unauthorized, Forbidden, ...)
    paths/
      health.yaml
      auth.yaml
      menu.yaml
      users.yaml
      orders.yaml
      admin.yaml
  ```
- **Segurança Global**: definida em `index.yaml` com `xAccessToken`. Por padrão, os endpoints exigem autenticação, a menos que o path defina `security: []` (ex.: `/health`, `/api/auth/*`, `/api/menu`).

## Autenticação e Segurança
- O backend aceita apenas um header de autenticação:
  - `x-access-token: <seu_token>`
- No Swagger UI, use o botão “Authorize” para informar o token uma única vez (campo `xAccessToken`).
- Perfis de acesso:
  - Endpoints administrativos exigem `ADMIN` ou `ROOT` (ex.: `/api/admin/*`).
  - Sem o perfil, o backend retorna `403 Forbidden`.

## Como executar e abrir o Swagger UI
1. Inicie o backend:
   ```bash
   npm run back
   # ou em desenvolvimento com reload
   npm run live
   ```
2. Abra a UI: `http://localhost:3333/docs`
3. Faça login em `/api/auth/login` (via Swagger, Postman ou curl) e copie o `token` retornado.
4. Clique em “Authorize” e informe o token em `xAccessToken`.
5. Use “Try it out” nos endpoints protegidos (ex.: `/api/users/me`).

## Fluxo rápido de teste pelo Swagger UI
1. Abra `/docs` e localize a tag `Auth`.
2. `POST /api/auth/login` – envie credenciais, por exemplo:
   ```json
   { "email": "root@uaifood.com", "password": "root" }
   ```
3. Copie o `token` do `LoginResponse`.
4. Clique em “Authorize” e informe o token em `xAccessToken`.
5. Teste endpoints protegidos:
   - `GET /api/users/me` (perfil do usuário logado)
   - `GET /api/orders` (pedidos do próprio usuário)
   - Endpoints admin (exigem `ADMIN/ROOT`): `GET /api/admin/orders`, `PATCH /api/admin/orders/{id}/status`, etc.

## Testes via curl (alternativa)
- Defina o token no shell:
  ```bash
  TOKEN="<cole_seu_token_aqui>"
  ```
- Usando `x-access-token`:
  ```bash
  curl -sS -H "x-access-token: $TOKEN" \
    http://localhost:3333/api/users/me | jq
  ```
- Admin (exemplo – listagem de pedidos):
  ```bash
  curl -sS -H "x-access-token: $TOKEN" \
    "http://localhost:3333/api/admin/orders?status=PREPARANDO" | jq
  ```

## Como editar/expandir a especificação
- Paths:
  - Adicione/edite em `backend/src/swagger/paths/*.yaml`.
  - Cada arquivo define operações (get/post/patch/delete), parâmetros, requestBody e responses.
  - Referencie schemas e respostas com **refs relativas** para os componentes, por exemplo:
    - `../components/schemas.yaml#/User`
    - `../components/responses.yaml#/Unauthorized`
- Componentes:
  - Adicione/edite schemas em `components/schemas.yaml`.
  - Padronize erros com `Error` e `ValidationError` definidos lá.
  - Respostas comuns em `components/responses.yaml` reaproveitam os schemas acima.
- Index:
  - Registre novos caminhos em `index.yaml` (secção `paths`), referindo o fragmento definido no arquivo de path correspondente, por exemplo:
    ```yaml
    /api/new/route:
      $ref: './paths/new.yaml#/newOperationId'
    ```

### Convenções adotadas
- Use chaves de status HTTP como strings nos `responses` (ex.: `'200'`, `'401'`).
- Mantenha nomes de schemas consistentes e reutilizáveis.
- Para validação em runtime, o projeto usa Zod (separado do Swagger). Tente manter Swagger e Zod em sincronia conceitual (campos, formatos, exemplos).

## Problemas comuns e soluções
- “Resolver error: Could not resolve pointer …”
  - Geralmente refs incorretas. Use refs relativas para arquivos externos (ex.: `../components/schemas.yaml#/User`).
  - Em `components/schemas.yaml`, quando referir outro schema do mesmo arquivo, use `#/OutrosSchema` (sem `#/components/schemas`).
  - Após ajustes, faça hard refresh no navegador (`Ctrl+Shift+R`).
  - Consulte `/docs.json` para ver se o documento raiz reflete as alterações.
- “401 Unauthorized” ou “403 Forbidden” nos testes
  - Verifique se o token foi informado no “Authorize”.
  - Confirme o perfil do usuário para endpoints `ADMIN/ROOT`.
- Porta ocupada (`EADDRINUSE: 3333`)
  - Encerre o processo que ocupa a porta ou ajuste `PORT` no `.env`.

## Exportar a especificação consolidada (opcional)
Caso precise de um único arquivo OpenAPI para distribuição/integração, você pode “empacotar” (bundle) a especificação modular:
- Via `swagger-cli` (npx):
  ```bash
  npx @apidevtools/swagger-cli bundle \
    backend/src/swagger/index.yaml \
    --outfile openapi.yaml --type yaml
  ```
- Via Redocly CLI (se preferir):
  ```bash
  npx @redocly/cli bundle backend/src/swagger/index.yaml -o openapi.yaml
  ```

## Geração de clientes (SDKs) – opcional
Com um arquivo OpenAPI único (por exemplo, `openapi.yaml` gerado acima), é possível gerar clientes em várias linguagens com o **OpenAPI Generator**:
```bash
npx @openapitools/openapi-generator-cli generate \
  -i openapi.yaml -g typescript-axios -o ./client-ts-axios
```

## Acesso rápido
- UI: `http://localhost:3333/docs`
- Especificação (raiz): `http://localhost:3333/docs-spec/index.yaml`
- Especificação (JSON auxiliar): `http://localhost:3333/docs.json`

---

Dica: mantenha os exemplos dos endpoints atualizados no Swagger – isso facilita testes e aumenta a qualidade da documentação compartilhada com o time.