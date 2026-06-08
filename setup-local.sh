#!/bin/bash

# Product Management System - Simple Local Setup (NO DOCKER)
# This script sets up everything locally on your machine

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Product Management System - Local Setup (NO DOCKER)      ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "\n${YELLOW}Verificando pré-requisitos...${NC}"

if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP não instalado${NC}"
    exit 1
fi

if ! command -v composer &> /dev/null; then
    echo -e "${RED}❌ Composer não instalado${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm não instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Todos os pré-requisitos encontrados${NC}"

# Backend Setup
echo -e "\n${YELLOW}📦 Configurando Backend...${NC}"
cd backend

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    # Use SQLite for simplicity
    sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
    touch database/database.sqlite
fi

# Install composer dependencies
echo "Instalando dependências Composer..."
composer install --no-interaction --prefer-dist

# Generate app key
echo "Gerando chave da aplicação..."
php artisan key:generate --force

# Run migrations
echo "Executando migrações..."
php artisan migrate:fresh --force --quiet

# Run seeders
echo "Populando banco de dados..."
php artisan db:seed --force --quiet

echo -e "${GREEN}✓ Backend configurado com sucesso!${NC}"

# Frontend Setup
echo -e "\n${YELLOW}📦 Configurando Frontend...${NC}"
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
fi

echo "Instalando dependências npm..."
npm install --silent

echo -e "${GREEN}✓ Frontend configurado com sucesso!${NC}"

# Final instructions
echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ Setup Completo! Próximos passos:              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}TERMINAL 1 - Backend:${NC}"
echo "  $ cd backend"
echo "  $ php artisan serve"
echo ""
echo -e "${YELLOW}TERMINAL 2 - Frontend:${NC}"
echo "  $ cd frontend"
echo "  $ npm run dev"
echo ""
echo -e "${YELLOW}🌐 URLs:${NC}"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo ""
echo -e "${YELLOW}🧪 Login com:${NC}"
echo "  Email: admin@example.com"
echo "  Senha: password123"
echo ""
