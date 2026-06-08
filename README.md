# � Product Management System

Sistema de gestão de produtos baseado em **microserviços**, onde cada cliente pode gerir os seus próprios produtos e o administrador pode visualizar estatísticas gerais do sistema.

## ✨ Features Principais

### 👤 Para Clientes
- ✅ **Autenticação Segura** - Registro e login com validação avançada
- ✅ **Gestão de Produtos** - Criar, editar, listar e apagar produtos
- ✅ **Controlo de Stock** - Acompanhar quantidade em stock
- ✅ **Interface Intuitiva** - Design moderno com Tailwind CSS

### 👨‍💼 Para Administradores
- ✅ **Painel de Estatísticas** - Visualizar dados gerais do sistema
- ✅ **Total de Clientes** - Monitore crescimento de utilizadores
- ✅ **Análise de Produtos** - Preço médio, máximo e total

## � Quick Start com Docker

```bash
# Na raiz do projeto
chmod +x reset.sh
./reset.sh
```

Espera ~30-60 segundos para o setup completar.

**Acesso Imediato:**
- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000/api
- 🗄️ **PHPMyAdmin:** http://localhost:8080
- 📊 **Backend:** http://localhost:8000

**Credenciais de Teste:**
```
Email: admin@example.com
Senha: password123
Role: admin (acesso a estatísticas)
```

## � Estrutura do Projeto

```
product/
├── 📂 frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/                 # Configuração Axios
│   │   ├── components/          # Navbar, componentes reutilizáveis
│   │   ├── pages/               # Home, Products, AdminDashboard, etc.
│   │   ├── context/             # AuthContext (autenticação)
│   │   ├── App.jsx              # Router principal
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 📂 backend/                   # Laravel 11 + Sanctum
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── Auth/            # AuthController (register, login, me)
│   │   │   ├── Products/        # ProductController (CRUD)
│   │   │   └── Admin/           # AdminController (stats)
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   └── Product.php
│   │   └── Requests/            # Form Requests validação
│   ├── routes/
│   │   └── api.php              # Rotas da API
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── config/
│   │   ├── cors.php
│   │   ├── sanctum.php
│   │   └── database.php
│   └── composer.json
│
├── 📂 nginx/                     # Configuração Nginx
├── docker-compose.yml           # Setup Docker
├── reset.sh                      # Script de inicialização
└── README.md
```

## � Autenticação & Autorização

A autenticação é implementada com **Laravel Sanctum**, usando **tokens Bearer JWT**.

### Headers Obrigatórios
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### Roles & Permissões
- **admin** - Acesso total (ver estatísticas, gerenciar sistema)
- **customer** - Acesso limitado (CRUD apenas seus produtos)

```bash
## 📡 API Endpoints

### Autenticação
```
POST   /api/register          # Registar novo utilizador
POST   /api/login             # Fazer login
POST   /api/logout            # Fazer logout
GET    /api/me                # Obter perfil atual
```

### Produtos
```
GET    /api/products          # Listar meus produtos
POST   /api/products          # Criar novo produto
GET    /api/products/{id}     # Ver produto específico
PUT    /api/products/{id}     # Atualizar produto
DELETE /api/products/{id}     # Apagar produto
```

### Admin
```
GET    /api/admin/stats       # Estatísticas do sistema (apenas admin)
```

## 🏗️ Stack Tecnológico

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool (super rápido!)
- **React Router v6** - Client-side routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Utility-first CSS
- **Context API** - State management

### Backend
- **Laravel 11** - PHP Framework
- **Sanctum** - API Authentication
- **MySQL 8.0** - Database
- **Composer** - Dependency manager

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server
- **PHP-FPM** - Application server

## 📋 Requisitos do Sistema

### Com Docker (Recomendado)
- Docker
- Docker Compose
- ~2GB RAM disponível

### Sem Docker
- PHP 8.4+
- Node.js 18+
- MySQL 8.0+
- Composer

## 🔐 Regras de Negócio

| # | Descrição |
|---|-----------|
| RN001 | Email deve ser único no sistema |
| RN002 | Senha mínimo 8 caracteres |
| RN003 | Novos utilizadores são customer por padrão |
| RN004 | Apenas admin vê estatísticas |
| RN005 | Produto obrigatoriamente pertence a utilizador |
| RN006 | Nome do produto obrigatório |
| RN007 | Preço deve ser > 0 |
| RN008 | Stock não pode ser negativo |
| RN009-011 | Utilizador só acede seus próprios produtos |

## 🚀 Deploy

### Backend
```bash
# Gerar build para produção
php artisan optimize
php artisan config:cache
php artisan route:cache
```

### Frontend
```bash
# Gerar build otimizado
npm run build
# Resultado em: dist/
```

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| CORS Error | Backend deve estar em `http://localhost:8000` |
| Token inválido | Fazer login novamente |
| Erro BD | Executar `php artisan migrate:fresh --seed` |
| Porta em uso | Mudar porta em `docker-compose.yml` |

## 📞 Suporte

- 📧 Email: support@productmanager.com
- 🌐 Website: https://productmanager.com
- 📚 Docs: `/api/docs`

---

**Versão:** 1.0.0 | **Última atualização:** 8 de Junho de 2026
