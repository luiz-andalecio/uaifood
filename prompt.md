
🍲 UAIFood — Descrição Geral e Fluxo de Funcionamento
O UAIFood é uma aplicação web voltada para o gerenciamento de pedidos em restaurantes, permitindo que o cliente faça o pedido diretamente do local, sem necessidade de entregas.
 A proposta é oferecer uma experiência simples, rápida e acolhedora, inspirada na culinária mineira e no atendimento presencial moderno.
A interface será construída em React, priorizando padronização visual, fluidez e clareza no uso.
 As cores principais serão branco (base), amarelo (secundário) e vermelho (terciário), reforçando uma identidade vibrante e aconchegante.
 Serão utilizados componentes prontos do React, com animações leves para tornar a navegação mais agradável e intuitiva.
 Todos os comentários do código estarão em português, no formato //comentário, de forma natural e sem linguagem de IA.
O foco principal é o entendimento completo do fluxo de uso — tanto para o cliente quanto para administradores e o usuário root — e na clareza das rotas, com documentação detalhada via Swagger.

O projeto está sendo feito no Linux Mint, com o VSCode aberto na raiz do diretório: “~/ADS/5 Quinto Período/DAW II/uaifood$”, então, quando formos usar códigos no terminal no backend ou no frontend, devemos informar o diretório correto: ~/ADS/5 Quinto Período/DAW II/uaifood/frontend$” ou “~/ADS/5 Quinto Período/DAW II/uaifood/backend$”  

🏠 Página Inicial (Home)
Ao acessar o site, o visitante encontra uma landing page moderna, convidativa e direta.
🔹 Navbar
Localizada no topo da página, a barra de navegação oferece as opções:
Início


Cardápio


Sobre


Carrinho


Entrar / Cadastrar


Após o login, “Entrar / Cadastrar” é substituído pelo ícone de perfil e o botão Logout.
� Autenticação no Frontend
- Existe um `AuthContext` que guarda `token` e `user` em memória. O token é salvo em `localStorage` e verificado no carregamento com a rota `/api/users/me`.
- O componente `ProtectedRoute` protege páginas privadas. Usuários não autenticados são redirecionados para `/login` e, após login, retornam para a rota original.
- A navbar mostra botões de “Entrar/Cadastrar” quando deslogado e “Perfil/Sair” quando logado. O link de perfil aponta para `/perfil`.

📄 Páginas protegidas
- `/perfil` — mostra nome, e-mail e tipo do usuário logado. Comentários do código seguem o padrão //comentário em português.

� Carrinho e Pedidos
- Existe um `CartContext` com persistência simples no navegador. O botão “+ Adicionar” no cardápio incrementa itens do carrinho.
- A navbar mostra um contador com o total de itens do carrinho.
- A página `/carrinho` permite ajustar quantidades e finalizar o pedido, enviando `tableNumber`, `paymentMethod` e os itens para `POST /api/orders`.
 - A página `/meus-pedidos` lista o histórico do usuário autenticado.

��🔹 Hero Section
Abaixo da navbar, uma apresentação com o lema:
“Sabor de Minas, na palma da mão.”
Com opções para:
Ver Cardápio


Criar Conta


E indicadores como:
300+ clientes satisfeitos


50+ pratos disponíveis


4.9 de avaliação média


🔹 Explore Nosso Cardápio
Seção de destaques com cards interativos:
Pratos Principais


Pizzas


Saladas


Bebidas


Sobremesas


Bolos


Cada card leva à página completa do cardápio.
🔹 Por Que Escolher o UAIFood?
Destaques dos diferenciais do restaurante:
Pedido simples e rápido


Pagamento seguro


Ingredientes de qualidade


Atendimento eficiente


🔹 Footer
O rodapé reúne:
Informações do restaurante


Links úteis


Termos e políticas


Contato e endereço



🍛 Cardápio
Na página de cardápio, o usuário encontra o menu completo, dividido por abas de categorias:
 Entradas, Pratos Principais, Acompanhamentos, Bebidas e Sobremesas.
Cada item é exibido com:
Nome


Preço


Botão Adicionar ao Carrinho


Exemplo:
Item
Preço
Ação
Feijão Tropeiro
R$ 12,00
[Adicionar]
Arroz Branco
R$ 8,00
[Adicionar]


🛒 Carrinho e Finalização
Ao acessar o ícone do carrinho, o usuário visualiza:
Itens adicionados


Quantidade


Total acumulado


Botão Finalizar Pedido


🔹 Fluxo de Confirmação
Ao clicar em “Finalizar Pedido”, o sistema verifica se há uma sessão ativa.


Se o usuário não estiver logado, é redirecionado para a página de login — podendo entrar ou se cadastrar.


Após o login, ele retorna automaticamente ao carrinho, com os itens preservados via cache.


Clicando novamente em “Finalizar Pedido”, surge um modal de confirmação com as opções:


Número da mesa


Método de pagamento: Dinheiro, Cartão de Crédito, Cartão de Débito ou PIX


Total do pedido


E o botão final [Confirmar Pedido], encerrando a compra.



🧾 Sobre o UAIFood
Página dedicada à história e à missão do sistema:
“Conectando você aos melhores sabores da culinária mineira, com praticidade e qualidade.”
Inclui:
Nossa História


Diferenciais


Missão e Valores


Os valores principais são qualidade, transparência, inovação e compromisso.

👤 Conta do Usuário
Ao clicar no ícone de perfil, surge um menu suspenso com opções variáveis conforme o tipo de conta.
🔸 Usuário Normal
Meu Perfil


Meus Pedidos


Configurações


Sair


🔹 Administrador
Meu Perfil


Meus Pedidos


Painel Administrativo


Configurações


Sair


🔺 Usuário Root
Meu Perfil


Painel Administrativo


Gerenciar Usuários


Configurações do Sistema


Sair


No perfil, cada usuário pode editar suas informações pessoais.
 Admins e Root podem visualizar e gerenciar perfis de outros usuários.

🧩 Painel Administrativo
Acesso restrito a Administradores e ao Root, disponível via botões na navbar.
- Rotas protegidas por role (RoleRoute): `/admin` (Dashboard), `/admin/cardapio` e `/admin/usuarios`.
- Na navbar, ADMIN/ROOT veem: “Admin”, “Cardápio” e “Usuários”.
📋 Gerenciar Cardápio
Permite executar o CRUD dos pratos:
Adicionar novo item


Editar informações


Excluir prato


Visualizar detalhes


Usuários comuns veem o cardápio apenas para pedidos.
👥 Gerenciar Usuários
Lista completa de usuários cadastrados, com tipo de conta e ações disponíveis:
Exemplo:
🧑‍💻 Nikko — Administradora


👤 Akemi — Usuário Normal


Ações disponíveis:
Ver perfil


Editar tipo de conta


Excluir usuário


O Root possui permissões extras:
Editar senhas


Promover/demover administradores


Excluir qualquer conta (inclusive de admins, via soft delete)



🔑 Hierarquia de Permissões
Ação
Usuário Normal
Admin
Root
Fazer pedidos
✅
✅
✅
Gerenciar cardápio
❌
✅
✅
Criar contas
❌
✅
✅
Editar tipo de conta
❌
✅ (normais)
✅ (todos)
Excluir usuários
❌
✅ (normais)
✅ (todos)
Editar senhas
❌
❌
✅
Promover/demover admins
❌
❌
✅
Acesso total
❌
❌
✅

O Root é o superadministrador e não pode ser excluído nem alterado por ninguém, garantindo o controle total do sistema.

Detalhes a serem considerados:
Confirmação visual e mensagens de sucesso/erro
Modais ou toasts no front após criar, editar ou excluir algo.
 ➡ Melhora a UX e dá impressão de sistema completo.


Autenticação protegida por middleware
Bloqueia acesso de usuários comuns às rotas de admin/root.


Exemplo: middleware de verificação de role no backend.
 ➡ Demonstra boas práticas de segurança e controle de permissões.
⚙️ a) Paginação e busca
Paginação simples nas listas (usuários, itens e pedidos).


Busca textual por nome de item ou email de usuário.
 ➡ Simples com Prisma + React, mas eleva muito a experiência e avaliação.


⚙️ b) Dashboard resumido para admins
Contadores: “Pedidos hoje”, “Total de usuários”, “Itens ativos”.
 ➡ Pode ser feito com apenas 3 queries e exibido em cards — rápido de montar e muito bonito visualmente.


⚙️ c) Validação de formulários (frontend e backend)
Impede campos vazios, emails inválidos, senhas curtas etc.
 ➡ Mostra atenção à UX e segurança.
🔚 Conclusão
O UAIFood foi pensado para unir simplicidade para o cliente e controle total para a administração.
 Clientes fazem pedidos de forma intuitiva e rápida, enquanto administradores e o Root mantêm o sistema organizado, com segurança e eficiência.
A plataforma combina usabilidade moderna, clareza de navegação e arquitetura robusta, garantindo uma experiência fluida e completa para todos os tipos de usuário.


Modelo de Banco de Dados — Detalhamento Completo (UAIFood)
Abaixo está um modelo relacional detalhado para o UAIFood pensado para PostgreSQL (compatível com Prisma/TypeScript). Descrevo tabelas, campos, tipos sugeridos, restrições, relacionamentos, índices recomendados, regras de integridade, enumerações e boas práticas operacionais (soft delete, auditoria, transações, etc.). Não é código executável — é um design descritivo pronto para ser transcrito em migrations.

Principais decisões de modelagem (visão geral)
Normalização até 3ª forma: entidades separadas para usuários, endereços, pedidos, itens, categorias e itens de pedido.


Roles explícitas (CLIENTE / ADMIN / ROOT). Root é tratado como role distinta; recomenda-se apenas um ou poucos records root controlados.


Soft delete para evitar perda acidental (campo deleted_at em tabelas críticas).


Campos de auditoria: created_at, updated_at, deleted_at, created_by (opcional).


Transações obrigatórias para criação de pedidos e operações de estoque/quantidade (garante atomicidade do Order + OrderItem).


Índices criados sobre FK e campos buscados com frequência (email, status, created_at).


Consistência referencial com FK e regras de ON DELETE/ON UPDATE bem definidas (uso de cascade ou restrict conforme sensibilidade).



Tabelas e campos
1. users (Usuários)
Descrição: Contém clientes, admins e root.


Campos principais:


id — UUID / bigserial (PK)


name — string (não nulo)


email — string (único, não nulo)


password_hash — string (não nulo)


phone — string (opcional)


role — enum { CLIENTE, ADMIN, ROOT } (não nulo)


is_active — boolean (padrão true)


avatar_url — string (opcional)


created_at, updated_at, deleted_at — timestamps


created_by — FK para users.id (opcional, mostra quem criou a conta)


Restrições / índices:


Unique index em email


Index em role e is_active


Observações: Root deve ser protegida; proibir downgrade do único root por regras de negócio.



2. addresses (Endereços)
Descrição: Endereços reutilizáveis; um usuário pode ter vários.


Campos principais:


id — PK


street, number, neighborhood, city, state, zip_code


complement — opcional


created_at, updated_at


Relacionamentos:


Tabela de junção user_addresses (veja abaixo) para suportar N:N se necessário ou FK direto user_id para 1:N.



3. user_addresses (opcional)
Descrição: Associa usuários a endereços (permite reuso do endereço).


Campos: id, user_id (FK → users), address_id (FK → addresses), label (ex: trabalho, casa), created_at.



4. categories (Categorias do cardápio)
Campos: id, name, description (opcional), created_at, updated_at.


Índices: unique em name.



5. items (Itens do cardápio)
Descrição: Cada prato/produto disponível.


Campos principais:


id — PK


name — string (não nulo)


description — text (opcional)


price — numeric(10,2) (não nulo)


category_id — FK → categories.id (nullable se livre)


image_url — string (opcional)


is_active — boolean (se item está disponível)


created_at, updated_at, deleted_at


Índices: index em category_id, is_active, name (full-text se busca textual).



6. orders (Pedidos)
Descrição: Pedido feito por um cliente dentro do restaurante.


Campos principais:


id — PK


user_id — FK → users.id (cliente)


table_number — string/integer (número da mesa)


payment_method — enum { DINHEIRO, DEBITO, CREDITO, PIX }


status — enum { PENDING, CONFIRMED, PREPARING, READY, SERVED, CANCELLED } (fluxo de vida do pedido)


subtotal — numeric


tax — numeric (opcional)


total — numeric


created_at, updated_at, cancelled_at


created_by — FK → users.id (quem registrou, útil quando admin cria pedido)


Índices: index em user_id, status, created_at.


Observação: Toda criação de order deve ocorrer em transação que insira order_items.



7. order_items (Itens do pedido)
Descrição: Relaciona orders e items com quantidade e preço no momento do pedido.


Campos principais:


id — PK


order_id — FK → orders.id


item_id — FK → items.id


quantity — integer (>=1)


unit_price — numeric (valor do item ao criar o pedido, evita problemas com alteração de preço futura)


total_price — numeric (quantity * unit_price)


observations — text (ex: sem cebola)


created_at, updated_at


Índices: index em order_id, item_id.



8. audit_logs (opcional, recomendado)
Descrição: Registro de ações críticas (criação/edição/exclusão de usuários, alteração de roles, exclusão de pedidos, etc.).


Campos: id, actor_user_id, action_type (string), resource_type, resource_id, details (JSON), created_at.


Benefício: Rastreabilidade e segurança.



Enums usados (lista)
UserRole → CLIENTE, ADMIN, ROOT


PaymentMethod → DINHEIRO, DEBITO, CREDITO, PIX


OrderStatus → PENDING, CONFIRMED, PREPARING, READY, SERVED, CANCELLED



Regras de integridade e cascades
users → orders: ON DELETE RESTRICT (não excluir usuário se existem pedidos históricos) ou soft delete.


items → order_items: ON DELETE RESTRICT (manter histórico do pedido).


categories → items: ON DELETE SET NULL ou RESTRICT dependendo da política.


Soft delete recomendado em users, items, orders (marcar deleted_at) ao invés de deletar fisicamente, para histórico e auditoria.



Índices e performance (recomendações)
Índice único em users.email.


Índices em orders.status, orders.created_at, order_items.order_id.


Índices em items.is_active e items.category_id.


Índices full-text em items.name e items.description para buscas no cardápio.


Considerar materialized views para dashboards (ex.: vendas diárias) se volume grande.


Particionamento por created_at em orders se ter alto volume histórico.



Operações sensíveis e transações
Criar pedido: abranger inserção em orders + múltiplos order_items em uma transação.


Alteração de role / exclusão de usuário: registrar em audit_logs e exigir confirmação (UI) para operações destrutivas, especialmente para Root.



Segurança e políticas de retenção
Armazenar apenas password_hash (bcrypt/argon2), nunca senha em texto.


deleted_at para soft delete; dados sensíveis (ex.: logs) retidos conforme LGPD/local — definir política de retenção (ex.: 5 anos para registros fiscais).


Limitar visibilidade de dados pessoais (PII) a funções administrativas necessárias.



Estratégias de backup e recuperação
Backups incrementais diários + full weekly.


Testar restore periodicamente (DR drill).


Exportação segura de audit logs para storage separado.



Exemplo de fluxo de uso do modelo (narrativo)
Um cliente cria conta (users).


Na sessão, visualiza items (filtrados por categories).


Ao montar pedido, frontend cria orders e insere order_items (transação). Os unit_price ficam gravados no order_items.


Admins usam o painel para inserir novos items e categorias; mudanças em items não alteram históricos porque order_items.unit_price guarda o preço do momento.


Root pode promover users (alterar role) e resetar senha; todas as ações críticas geram entradas em audit_logs.



Observações finais e recomendações práticas
Defina claramente comportamentos de cascade vs soft delete antes de implementar.


Garanta mecanismos de retenção/anonimização para conformidade com leis de privacidade.


Planeje índices pensando em consultas reais (ex.: lista de pedidos por status para cozinha).


Mantenha order_items.unit_price para evitar inconsistências históricas.


Limite contas ROOT; proteja endpoints e operações relacionadas com dupla confirmação e logs.





Perfeito, Luiz — isso vai te ajudar muito a manter o ritmo certo até o dia 19 sem se enrolar com tarefas paralelas.
 Abaixo está um roteiro de entrega de features cuidadosamente planejado para um projeto fullstack React + Node/Express + Prisma + PostgreSQL, com autenticação, CRUD e painel administrativo, dentro dos 15 dias restantes (4 a 19 de novembro).
Ele é dividido por fases, com metas realistas para cada dia e prioridades bem claras.
 Você pode adaptar o ritmo conforme for avançando, mas seguir esta sequência garante que o projeto fique completo, funcional e apresentável a tempo.

🗓️ Roteiro de Entrega — Projeto UAIFood
Prazo final: 19 de novembro
 Meta: Sistema completo, funcional e apresentável, com frontend e backend integrados.

🧩 Fase 1 — Base do Projeto e Banco de Dados (04–06/nov)
Objetivo: Preparar a estrutura do sistema e garantir que o backend tenha base sólida.
🗓️ 4 de nov (hoje)
Criar repositório no Git e estrutura de pastas (frontend/ e backend/).


Configurar ambiente (Node, Docker, PostgreSQL, VS Code, Prisma, etc).


Criar projeto React com Vite + Tailwind.


Criar projeto Express com TypeScript.


Escrever README inicial com escopo e instruções de execução.


🗓️ 5 de nov
Definir modelo do banco de dados no Prisma:


Usuário


Endereço


Categoria


Item


Pedido


ItemPedido


Rodar prisma migrate dev e confirmar estrutura no banco.


Popular o banco com alguns dados iniciais (seed).


🗓️ 6 de nov
Criar rotas iniciais no backend:


/users


/items


/categories


Configurar Swagger com documentação de cada rota.


Testar rotas com Insomnia/Postman.



🔐 Fase 2 — Autenticação e Perfis de Usuário (07–09/nov)
Objetivo: Implementar o sistema de login, cadastro e controle de permissões.
🗓️ 7 de nov
Implementar autenticação com JWT + Bcrypt.


Criar middlewares:


verifyToken


isAdmin


isRoot


Criar rota /auth/login e /auth/register.


🗓️ 8 de nov
Conectar frontend com rotas de autenticação.


Criar páginas:


Login


Cadastro


Testar fluxo completo: cadastro → login → acesso à home.


🗓️ 9 de nov
Implementar controle de rotas protegidas no React Router.


Navbar dinâmica (muda conforme o tipo de usuário).


Página de perfil com dados do usuário logado.



🍽️ Fase 3 — Cardápio e Carrinho (10–13/nov)
Objetivo: Permitir ao cliente visualizar o menu e montar pedidos.
🗓️ 10 de nov
Criar rotas backend:


/menu (listar itens e categorias)


/orders (criar pedido)


Implementar modelos Item e OrderItem no Prisma.


Criar endpoints para adicionar e remover itens do pedido.


🗓️ 11 de nov
No frontend: criar página “Cardápio”.


Exibir categorias em abas (tabs).


Cada item com nome, preço e botão “Adicionar ao carrinho”.


Criar estado global (ou context) para gerenciar o carrinho.


Implementar botão do carrinho na navbar com contador de itens.


🗓️ 12 de nov
Página “Carrinho” com listagem de itens, total e botão “Finalizar Pedido”.


Implementar modal de confirmação do pedido (mesa, pagamento etc.).


Testar persistência e fluxo do pedido.


🗓️ 13 de nov
Criar página “Meus Pedidos” (usuário comum):


Histórico dos pedidos feitos.


Exibir status e valor total.


Backend: rota /orders/user/:id.



🧑‍💼 Fase 4 — Painel Administrativo (14–16/nov)
Objetivo: Permitir que Admin e Root gerenciem usuários e cardápio.
🗓️ 14 de nov
Criar rota /admin/items (CRUD completo dos pratos).


Implementar no front:


Página “Gerenciar Cardápio”.


Tabela com nome, preço, categoria e botões “Editar” / “Excluir”.


Modal de “Novo Prato”.


🗓️ 15 de nov
Criar rota /admin/users (listagem e edição de tipos de conta).


Implementar página “Gerenciar Usuários”:


Mostrar nome, tipo (cliente/admin/root).


Botões de editar tipo ou excluir.


Restringir permissões (apenas root pode editar admins).


🗓️ 16 de nov
Adicionar painel de resumo (Dashboard):


Contagem de pedidos, usuários e pratos.


Mostra apenas para admins e root.


Criar página “Configurações” genérica (para todos os tipos de conta).



🎨 Fase 5 — Polimento e Apresentação (17–19/nov)
Objetivo: Melhorar a UX, revisar bugs e preparar o sistema para apresentação.
🗓️ 17 de nov
Adicionar animações leves (Fade, Slide, Hover).


Mensagens de sucesso/erro (toasts).


Melhorar responsividade com Tailwind.


🗓️ 18 de nov
Revisar fluxo geral:


Login → Cardápio → Pedido → Histórico.


Admin → Painel → Gerenciar Usuários.


Conferir documentação Swagger.


Escrever README final detalhado (como rodar, credenciais de teste).


🗓️ 19 de nov
Apresentação / entrega final.



