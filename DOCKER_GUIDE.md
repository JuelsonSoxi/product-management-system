# 🐳 GUIA DOCKER - Product Management System

## Pré-requisitos

- Docker Desktop instalado (https://www.docker.com/products/docker-desktop)
- Docker Compose (incluído no Docker Desktop)

**Verificar instalação:**
```bash
docker --version
docker compose --version
```

---

## ⚡ Quick Start com Docker

### 1. Setup Automático (Recomendado)

Na **raiz do projeto**:

```bash
chmod +x reset.sh
./reset.sh
```

Espera ~60 segundos enquanto o script:
- ✅ Constrói e inicia containers
- ✅ Instala dependências
- ✅ Cria banco de dados
- ✅ Executa migrations
- ✅ Popula com dados de teste

### 2. Pronto! Acessa:

| URL | Descrição |
|-----|-----------|
| http://localhost:3000 | Frontend React |
| http://localhost:8000 | Backend API |
| http://localhost:8080 | PHPMyAdmin |

---

## 📊 Credenciais de Teste

```
Email: admin@example.com
Senha: password123
```

Ou customer1@example.com / password123

---

## 🛠️ Comandos Docker Úteis

### Iniciar containers
```bash
docker compose up -d
```

### Parar containers
```bash
docker compose down
```

### Parar e remover volumes (limpa dados)
```bash
docker compose down -v
```

### Ver logs
```bash
# Todos os containers
docker compose logs -f

# Apenas backend
docker compose logs -f backend

# Apenas frontend
docker compose logs -f frontend
```

### Executar comandos inside backend
```bash
# Ver usuários no banco
docker compose exec backend php artisan tinker
>>> User::all()

# Resetar banco
docker compose exec backend php artisan migrate:fresh --seed

# Ver tabelas
docker compose exec backend php artisan tinker
>>> Schema::getTables()
```

### Acessar container interativo
```bash
# Backend shell
docker compose exec backend bash

# MySQL shell
docker compose exec db mysql -u sis_user -psis_password sis_db
```

---

## 📁 Estrutura dos Containers

```
Frontend Container (Node)
    ↓
Backend Container (PHP)
    ↓
Database Container (MySQL)
    ↓
PHPMyAdmin Container
```

---

## 🧯 Troubleshooting Docker

### Erro: "Address already in use"
Alguma porta já está em uso.

**Solução:**
```bash
# Ver containers em execução
docker ps

# Parar tudo
docker compose down

# Ou mudar portas em docker-compose.yml
```

### Erro: "Cannot connect to Docker"
Docker não está rodando.

**Solução:**
- Abra Docker Desktop
- Espere inicializar
- Tente novamente

### Erro: "Out of disk space"
Docker está usando muito espaço.

**Solução:**
```bash
# Limpar dados não usados
docker system prune -a --volumes
```

### Containers não iniciam
Backend pode estar com erro.

**Solução:**
```bash
# Ver logs
docker compose logs -f backend

# Rebuildar
docker compose up -d --build
```

### Banco de dados vazio
Migrations não executaram.

**Solução:**
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

---

## 🔧 Customizar Portas

Se as portas padrão estão em uso, edite `docker-compose.yml`:

```yaml
# Frontend (padrão 3000)
ports:
  - "3001:3000"

# Backend (padrão 8000)
ports:
  - "8001:80"

# PHPMyAdmin (padrão 8080)
ports:
  - "8081:80"

# MySQL (padrão 3307)
ports:
  - "3308:3306"
```

---

## 📝 Variáveis de Ambiente

### Backend (.env do Docker)

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sis_db
DB_USERNAME=sis_user
DB_PASSWORD=sis_password
```

### Frontend (.env do Docker)

```
VITE_API_URL=http://localhost:8000/api
```

---

## 📊 Monitoring

### Ver status dos containers
```bash
docker compose ps
```

### Ver CPU/Memória
```bash
docker stats
```

### Ver histórico de build
```bash
docker images
```

---

## 🚀 Build & Deploy

### Rebuild sem cache
```bash
docker compose up -d --build --no-cache
```

### Ver tamanho das imagens
```bash
docker images
```

### Remover imagens antigas
```bash
docker image prune -a
```

---

## 💾 Backup & Restore

### Backup da base de dados
```bash
docker compose exec db mysqldump -u sis_user -psis_password sis_db > backup.sql
```

### Restaurar base de dados
```bash
docker compose exec -T db mysql -u sis_user -psis_password sis_db < backup.sql
```

---

## 📋 Checklist

- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] Correr `./reset.sh`
- [ ] Acesso Frontend em http://localhost:3000
- [ ] Acesso Backend em http://localhost:8000/api/health
- [ ] Login com admin@example.com

---

## 🎓 Estrutura do Projeto com Docker

```
project-management-system/
├── backend/
│   ├── Dockerfile          ← Imagem PHP
│   ├── .env.example
│   └── ... (Laravel files)
│
├── frontend/
│   ├── Dockerfile          ← Imagem Node
│   ├── .env.example
│   └── ... (React files)
│
├── nginx/
│   ├── conf.d/default.conf ← Configuração web server
│   └── ssl/
│
├── docker-compose.yml       ← Orquestra os containers
├── reset.sh                 ← Script automático
└── README.md
```

---

## 🎉 Pronto!

Com Docker, tudo está isolado e pronto para:
- ✅ Desenvolvimento
- ✅ Testes
- ✅ Deploy em produção

**Boa sorte!** 🚀
