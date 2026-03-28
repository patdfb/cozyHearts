# Cozy Hearts Backend

Backend API para a plataforma Cozy Hearts, construída com Express.js e Supabase.

## Estrutura

```
backend-app/
├── lib/
│   ├── supabase.js    # Inicialização do cliente Supabase
│   └── storage.js     # Configuração multer para upload de arquivos
├── routes/
│   ├── auth.js        # Autenticação e registro de usuários
│   ├── atividades.js  # Gestão de atividades
│   └── usuarios.js    # Gestão de perfil de usuários
├── index.js           # Servidor principal
├── package.json
└── .env               # Variáveis de ambiente
```

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` com as variáveis de ambiente:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
PORT=3000
```

## Execução

Para iniciar o servidor em desenvolvimento:
```bash
npm run dev
```

Para iniciar em produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## Endpoints

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `PUT /auth/usuario` - Editar perfil do usuário

### Atividades
- `GET /atividades` - Listar todas as atividades
- `GET /atividades/:id` - Obter detalhes de uma atividade
- `POST /atividades` - Criar nova atividade (requer autenticação)
- `POST /atividades/:id/join` - Participar de uma atividade
- `POST /atividades/:id/leave` - Sair de uma atividade

### Usuários
- `GET /usuarios/profile` - Obter perfil do usuário autenticado
- `GET /usuarios/activities` - Listar atividades do usuário
- `POST /usuarios/interests/:id_interesse` - Adicionar interesse
- `DELETE /usuarios/interests/:id_interesse` - Remover interesse
