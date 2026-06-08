# 🚀 Product Management System

Sistema de gestão de produtos onde cada cliente pode gerir os seus próprios produtos e o administrador pode visualizar estatísticas gerais do sistema.

## 📋 Requisitos

- PHP 8.2+
- Composer
- Node.js 16+
- npm ou yarn
- MySQL/PostgreSQL (ou SQLite para desenvolvimento)

## ⚡ Quick Start (Automático)

```bash
# Dar permissão ao script
chmod +x setup.sh

# Executar setup automático
./setup.sh
```

Este script fará:
- ✅ Instalar dependências do backend (Composer)
- ✅ Instalar dependências do frontend (npm)
- ✅ Criar arquivo .env
- ✅ Gerar chave da aplicação
- ✅ Executar migrações
- ✅ Popular banco de dados com dados de teste

## 🔧 Setup Manual

### Backend Setup

```bash
cd backend

# 1. Instalar dependências
composer install

# 2. Copiar arquivo de ambiente
cp .env.example .env

# 3. Gerar chave da aplicação
php artisan key:generate

# 4. Executar migrações
php artisan migrate

# 5. Popular banco de dados (seeders)
php artisan db:seed

# 6. Iniciar servidor
php artisan serve
```

O servidor backend será iniciado em: **http://localhost:8000**

### Frontend Setup

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

O servidor frontend será iniciado em: **http://localhost:5173**

## 🧪 Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@example.com | password123 | Admin |
| customer1@example.com | password123 | Customer |
| customer2@example.com | password123 | Customer |

## 📚 Documentação da API

### Autenticação

#### POST /api/register
Registar novo utilizador

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

#### POST /api/login
Fazer login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### GET /api/me
Obter perfil do utilizador atual (requer autenticação)

```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### POST /api/logout
Fazer logout (requer autenticação)

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Produtos

#### POST /api/products
Criar novo produto (requer autenticação)

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 5
  }'
```

#### GET /api/products
Listar todos os produtos do utilizador (requer autenticação)

```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### GET /api/products/{id}
Ver produto específico (requer autenticação)

```bash
curl -X GET http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### PUT /api/products/{id}
Atualizar produto (requer autenticação)

```bash
curl -X PUT http://localhost:8000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "description": "Updated description",
    "price": 1299.99,
    "stock": 10
  }'
```

#### DELETE /api/products/{id}
Apagar produto (requer autenticação)

```bash
curl -X DELETE http://localhost:8000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin

#### GET /api/admin/stats
Obter estatísticas do sistema (requer autenticação, apenas admin)

```bash
curl -X GET http://localhost:8000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "statistics": {
    "total_registered_clients": 2,
    "total_users": 3,
    "total_admins": 1,
    "total_products": 4,
    "average_products_per_customer": 2
  }
}
```

## 🏗️ Estrutura do Projeto

```
product-management-system/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── Auth/
│   │   │   │       ├── Products/
│   │   │   │       └── Admin/
│   │   │   └── Requests/
│   │   └── Models/
│   │       ├── User.php
│   │       └── Product.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── .env.example
│
├── frontend/                # React App
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml       # Docker configuration
├── setup.sh                 # Automated setup script
├── README.md               # This file
└── PROJECT_STRUCTURE.md    # Detailed project structure
```

## 🔐 Regras de Negócio Implementadas

| Código | Descrição |
|--------|-----------|
| RN001 | Email deve ser único |
| RN002 | Palavra-passe deve possuir no mínimo 8 caracteres |
| RN003 | Todo utilizador registado recebe o papel customer por defeito |
| RN004 | Apenas administradores podem consultar estatísticas |
| RN005 | Todo produto deve pertencer a um utilizador |
| RN006 | Nome do produto é obrigatório |
| RN007 | Preço deve ser maior que zero |
| RN008 | Stock não pode ser negativo |
| RN009 | Utilizador só pode visualizar os seus próprios produtos |
| RN010 | Utilizador só pode editar os seus próprios produtos |
| RN011 | Utilizador só pode apagar os seus próprios produtos |

## 🐳 Docker (Opcional)

Se preferir usar Docker:

```bash
# Iniciar containers
docker-compose up -d

# Executar setup
docker-compose exec backend php artisan migrate:fresh --seed
docker-compose exec frontend npm run dev
```

## 🧪 Testes

### Backend - Executar testes

```bash
cd backend
php artisan test
```

### Frontend - Executar testes

```bash
cd frontend
npm test
```

## 📊 Banco de Dados

### Tabelas principais

#### users
- id (bigint, primary)
- name (string)
- email (string, unique)
- password (string, hashed)
- role (enum: admin, customer)
- created_at, updated_at (timestamps)

#### products
- id (bigint, primary)
- user_id (bigint, foreign)
- name (string)
- description (text)
- price (decimal 10,2)
- stock (integer)
- created_at, updated_at (timestamps)

## 🔗 Relacionamentos

```
User (1) ---- (Many) Product
```

Cada utilizador pode ter múltiplos produtos.
Cada produto pertence a um único utilizador.

## 🛠️ Troubleshooting

### Problema: Erro "CORS policy"

**Solução:** Certifique-se que o backend está rodando e acessível em `http://localhost:8000`

### Problema: Erro "Token not provided"

**Solução:** Certifique-se que o token está sendo enviado no header:
```
Authorization: Bearer YOUR_TOKEN
```

### Problema: Erro de banco de dados

**Solução:** Execute as migrações novamente:
```bash
php artisan migrate:fresh --seed
```

### Problema: Dependências não instaladas

**Solução:** Reinstale:
```bash
# Backend
cd backend && composer install

# Frontend
cd frontend && npm install
```

## 📝 Logs

### Backend logs
```bash
cd backend
tail -f storage/logs/laravel.log
```

### Frontend logs
Abra o Console do navegador (F12)

## 🚀 Deploy

### Backend (Laravel)
1. Deploy em servidor PHP (8.2+)
2. Configurar variáveis de ambiente (.env)
3. Executar `php artisan migrate --force`
4. Configurar webserver (Apache/Nginx)

### Frontend (React)
1. Build: `npm run build`
2. Deploy a pasta `dist/` em servidor web estático
3. Configurar VITE_API_URL para apontar ao backend

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa em `PROJECT_STRUCTURE.md` e `API_DOCUMENTATION.md`

## 📄 Licença

MIT

---

**Última atualização:** 7 de Junho de 2026
