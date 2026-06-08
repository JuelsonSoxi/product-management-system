#!/bin/bash

echo "🗑️  Removendo containers e volumes..."
docker compose down -v

echo "🔨 Reconstruindo containers..."
docker compose up -d --build

echo "⏳ Aguardando containers iniciarem... (30s)"
sleep 30

echo "📦 Instalando dependências..."
docker compose exec -T backend composer install --no-interaction

echo "🔑 Gerando chave da aplicação..."
docker compose exec -T backend php artisan key:generate --force

echo "🗄️  Executando migrations..."
docker compose exec -T backend php artisan migrate:fresh --force

echo "🌱 Executando seeders..."
docker compose exec -T backend php artisan db:seed --force

echo "📁 Configurando permissões..."
docker compose exec -T backend chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

echo "✅ Setup completo!"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  PHPMyAdmin: http://localhost:8081"
echo ""
echo "🧪 Credenciais:"
echo "  Email: admin@example.com"
echo "  Senha: password123"
echo ""

docker compose ps
