# 🚀 GUIA RÁPIDO - Como Rodar o Projeto

## 🐳 Opção 1: Com Docker (Recomendado) ⭐

### Pré-requisitos
- Docker instalado
- Docker Compose instalado

### Setup

```bash
# Na raiz do projeto
chmod +x reset.sh
./reset.sh
```

Espera ~30-60 segundos para o setup completar.

**Acesso:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PHPMyAdmin: http://localhost:8080
- API Health: http://localhost:8000/api/health

---

## 💻 Opção 2: Setup Local (Sem Docker)

### 1. Backend (Laravel)

```bash
cd backend

# Instalar dependências
composer install

# Copiar .env
cp .env.example .env

# Gerar chave
php artisan key:generate

# Migrations + Seeders
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve
```

O backend roda em: **http://localhost:8000**

### 2. Frontend (React)

Num outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
# IMPORTANTE: Mudar VITE_API_URL para http://localhost:8000/api

# Iniciar dev server
npm run dev
```

O frontend roda em: **http://localhost:5173**

---

## 🧪 Credenciais de Teste

| Email | Senha | Tipo |
|-------|-------|------|
| admin@example.com | password123 | Admin (ver stats) |
| customer1@example.com | password123 | Customer (CRUD) |
| customer2@example.com | password123 | Customer (CRUD) |

---

## 📍 URLs Importantes

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | Frontend |
| http://localhost:8000 | Backend |
| http://localhost:8000/api/health | Health Check |
| http://localhost:8000/api/login | API Login |
| http://localhost:8000/api/products | API Produtos |
| http://localhost:8000/api/admin/stats | API Admin Stats |

---

## 🧯 Troubleshooting

### Erro: "Address already in use"
```bash
# Backend usa porta 8000
# Se ocupada, execute:
php artisan serve --port=8001

# Frontend usa porta 5173
# Se ocupada, npm muda automaticamente
```

### Erro: "CORS policy"
- Certifique-se que backend está rodando
- Verifique que VITE_API_URL está correto em frontend/.env

### Erro: "Token not found"
- Faça login novamente
- Limpe localStorage (F12 > Application > Storage)

### Banco de dados vazio
```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 🔧 Comandos Úteis

### Backend
```bash
cd backend

# Ver logs em tempo real
tail -f storage/logs/laravel.log

# Resetar banco de dados
php artisan migrate:fresh --seed

# Tinker (REPL)
php artisan tinker

# Limpar cache
php artisan cache:clear
```

### Frontend
```bash
cd frontend

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

---

## 📊 Fluxo de Dados

```
Frontend (React)
    ↓
API Client (Axios)
    ↓
Backend (Laravel API)
    ↓
Database (MySQL/SQLite)
```

### Autenticação
1. User faz Login
2. Backend retorna token JWT
3. Frontend guarda no localStorage
4. Próximas requisições incluem token no header
5. Backend valida token com Sanctum

---

## 🎯 Funcionalidades

### Para Customers
- ✅ Registar
- ✅ Login
- ✅ Ver Perfil
- ✅ Criar Produto
- ✅ Listar seus Produtos
- ✅ Editar seus Produtos
- ✅ Apagar seus Produtos

### Para Admin
- ✅ Login
- ✅ Ver Perfil
- ✅ Ver Estatísticas do Sistema
  - Total de Clientes
  - Total de Produtos
  - Média de Produtos por Cliente

---

## 🚀 Build para Produção

### Backend
```bash
cd backend
# Já está pronto para deploy
# Fazer upload de tudo menos vendor/ e node_modules/
# Executar: php artisan migrate --force
```

### Frontend
```bash
cd frontend
npm run build
# Faz upload da pasta dist/ para servidor web
```

---

## 💡 Dicas

1. **Postman/Insomnia**: Use para testar API
2. **Devtools**: F12 no navegador para debug
3. **Logs**: Verifique storage/logs/laravel.log para erros
4. **Migrations**: Execute `php artisan migrate:fresh --seed` se algo der errado

---

## ✨ Projeto Pronto!

Tudo está configurado e funcionando. Se tiver dúvidas, consulte:
- README.md (instruções detalhadas)
- API_DOCUMENTATION.md (endpoints da API)
- PROJECT_STRUCTURE.md (estrutura completa)

Boa sorte! 🎉
