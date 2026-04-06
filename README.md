# Task Manager — Frontend

Interface web para gerenciamento de tarefas com suporte a colaboração entre usuários. Desenvolvida com Vue 3, TypeScript e Tailwind CSS v4, integrada a uma API REST com autenticação JWT.

---

## ✨ Funcionalidades

- **Autenticação** — Login e cadastro de usuários com JWT
- **Tarefas** — Criar, listar, alterar status e excluir tarefas
- **Categorias** — Organizar tarefas por categoria (criação inline)
- **Colaboração** — Compartilhar tarefas com outros usuários por e-mail
- **Relatórios** — Dashboard com métricas, progresso por categoria e atividade recente

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Vue 3](https://vuejs.org/) | beta | Framework principal |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Tipagem estática |
| [Vite](https://vite.dev/) | ^8.0 | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Estilização utilitária |
| [Pinia](https://pinia.vuejs.org/) | ^3.0 | Gerenciamento de estado |
| [Vue Router](https://router.vuejs.org/) | ^4.6 | Roteamento SPA |
| [Axios](https://axios-http.com/) | ^1.14 | Cliente HTTP |

---

## 📁 Estrutura do projeto

```
src/
├── assets/
│   └── images/              # Imagens estáticas
├── components/
│   ├── icons/               # Ícones SVG como componentes Vue
│   ├── tasks/               # Componentes de tarefas
│   │   ├── TaskCard.vue
│   │   ├── TaskStatusBadge.vue
│   │   ├── MetricCard.vue
│   │   ├── MetricsWidget.vue
│   │   ├── CreateTaskModal.vue
│   │   ├── DeleteTaskModal.vue
│   │   └── ShareTaskModal.vue
│   └── ui/                  # Componentes reutilizáveis
│       ├── AppIcon.vue      # Ícone dinâmico por nome
│       ├── AppLayout.vue    # Layout com header e nav
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       └── ToastContainer.vue
├── lib/
│   └── api.ts               # Instância axios configurada
├── router/
│   └── index.ts             # Rotas e guards de navegação
├── services/
│   ├── authService.ts       # POST /sessions
│   ├── userService.ts       # POST /users
│   ├── taskService.ts       # CRUD /tasks
│   ├── categoryService.ts   # POST /categories
│   └── metricsService.ts    # GET /metrics
├── stores/
│   ├── auth.ts              # Autenticação e JWT
│   ├── tasks.ts             # Estado das tarefas
│   ├── metrics.ts           # Estado das métricas
│   └── toast.ts             # Notificações globais
├── types/
│   ├── auth.ts              # User, AuthUser, LoginPayload...
│   └── task.ts              # Task, Metrics, TaskStatus...
└── views/
    ├── auth/
    │   ├── LoginView.vue
    │   └── RegisterView.vue
    └── tasks/
        ├── TasksView.vue
        └── ReportsView.vue
```

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js `^20.19.0` ou `>=22.12.0`
- Backend da API rodando (veja variáveis de ambiente)

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

> Um arquivo `.env.example` está disponível como referência.

### Desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Type-check

```bash
npm run type-check
```

### Formatação de código

```bash
npm run format
```

---

## 🔐 Autenticação

O JWT é armazenado no `localStorage` e injetado automaticamente em todas as requisições via header `Authorization: Bearer <token>`. O ID do usuário é extraído do payload do token para verificação de ownership nas tarefas.

As rotas protegidas redirecionam para `/login` caso o token não esteja presente. Rotas de convidado (login/register) redirecionam para `/tasks` caso o usuário já esteja autenticado.

---

## 🔗 Integração com a API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/users` | Cadastro de usuário | ❌ |
| `POST` | `/sessions` | Login | ❌ |
| `GET` | `/tasks` | Listar tarefas | ✅ |
| `POST` | `/tasks` | Criar tarefa | ✅ |
| `PATCH` | `/tasks/:id/status` | Atualizar status | ✅ |
| `DELETE` | `/tasks/:id` | Excluir tarefa | ✅ |
| `POST` | `/tasks/:id/share` | Compartilhar tarefa | ✅ |
| `POST` | `/categories` | Criar categoria | ✅ |
| `GET` | `/metrics` | Métricas do usuário | ✅ |

---

## 💻 IDE recomendada

[VS Code](https://code.visualstudio.com/) com as extensões:

- [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
