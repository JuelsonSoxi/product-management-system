#!/bin/bash

# Product Management System - Setup Script
# This script sets up both backend and frontend

set -e

echo "=========================================="
echo "Product Management System - Setup"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "Installing composer dependencies..."
composer update --quiet 2>/dev/null || composer install --quiet

echo "Generating app key..."
php artisan key:generate --quiet

echo "Running migrations..."
php artisan migrate --force --quiet

echo "Seeding database..."
php artisan db:seed --quiet

echo -e "${GREEN}✓ Backend setup completed!${NC}"

# Frontend Setup
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd ../frontend

echo "Installing npm dependencies..."
npm install --quiet

echo -e "${GREEN}✓ Frontend setup completed!${NC}"

# Display next steps
echo -e "\n${GREEN}=========================================="
echo "Setup Complete! Next steps:"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Start Backend:${NC}"
echo "  cd backend"
echo "  php artisan serve"
echo ""
echo -e "${YELLOW}Terminal 2 - Start Frontend:${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "  Email: admin@example.com / customer1@example.com"
echo "  Password: password123"
echo ""
echo -e "${YELLOW}API Docs:${NC}"
echo "  http://localhost:8000/api/health"
echo ""
echo -e "${YELLOW}Frontend:${NC}"
echo "  http://localhost:5173"
echo ""
