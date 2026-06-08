# Product Management System API

## Overview
Sistema de gestão de produtos onde cada cliente pode gerir os seus próprios produtos e o administrador pode visualizar estatísticas gerais do sistema.

## Architecture

### Backend
- **Auth Service**: Laravel (Registro, Login, Autenticação, Perfis)
- **Product Service**: Laravel (CRUD de Produtos)
- **Database**: PostgreSQL/MySQL com tabelas Users e Products

### Frontend
- **Technology**: React

## Database Schema

### Users Table
```
- id: bigint (primary key)
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum(admin, customer) - default: customer
- created_at: timestamp
- updated_at: timestamp
```

### Products Table
```
- id: bigint (primary key)
- user_id: bigint (foreign key)
- name: string
- description: text (nullable)
- price: decimal(10,2)
- stock: integer
- created_at: timestamp
- updated_at: timestamp
```

## Roles & Permissions

### Admin
- Login
- View System Statistics

### Customer
- Register
- Login
- View Profile
- Create Product
- List Products
- Update Product
- Delete Product

## Business Rules

### RN001
Email deve ser único.

### RN002
Palavra-passe deve possuir no mínimo 8 caracteres.

### RN003
Todo utilizador registado recebe o papel customer por defeito.

### RN004
Apenas administradores podem consultar estatísticas do sistema.

### RN005
Todo produto deve pertencer a um utilizador.

### RN006
Nome do produto é obrigatório.

### RN007
Preço deve ser maior que zero.

### RN008
Stock não pode ser negativo.

### RN009
Utilizador só pode visualizar os seus próprios produtos.

### RN010
Utilizador só pode editar os seus próprios produtos.

### RN011
Utilizador só pode apagar os seus próprios produtos.

## API Endpoints

### Authentication Service

#### POST /api/register
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "token_here"
}
```

#### POST /api/login
Login user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "token_here"
}
```

#### GET /api/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST /api/logout
Logout user (requires authentication).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Product Service

#### POST /api/products
Create a new product (requires authentication, customer role).

**Request:**
```json
{
  "name": "Laptop Dell XPS 13",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stock": 5
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "user_id": 1,
    "name": "Laptop Dell XPS 13",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 5,
    "created_at": "2026-06-07T10:00:00Z",
    "updated_at": "2026-06-07T10:00:00Z"
  }
}
```

#### GET /api/products
List all products for the authenticated user.

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Laptop Dell XPS 13",
      "description": "High-performance laptop",
      "price": 1299.99,
      "stock": 5,
      "created_at": "2026-06-07T10:00:00Z",
      "updated_at": "2026-06-07T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### GET /api/products/{id}
Show a specific product.

**Response:**
```json
{
  "product": {
    "id": 1,
    "user_id": 1,
    "name": "Laptop Dell XPS 13",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 5,
    "created_at": "2026-06-07T10:00:00Z",
    "updated_at": "2026-06-07T10:00:00Z"
  }
}
```

#### PUT /api/products/{id}
Update a product.

**Request:**
```json
{
  "name": "Laptop Dell XPS 13",
  "description": "Updated description",
  "price": 1299.99,
  "stock": 10
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "user_id": 1,
    "name": "Laptop Dell XPS 13",
    "description": "Updated description",
    "price": 1299.99,
    "stock": 10,
    "created_at": "2026-06-07T10:00:00Z",
    "updated_at": "2026-06-07T10:00:00Z"
  }
}
```

#### DELETE /api/products/{id}
Delete a product.

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### Admin Service

#### GET /api/admin/stats
Get system statistics (requires authentication, admin role).

**Response:**
```json
{
  "statistics": {
    "total_registered_clients": 10,
    "total_users": 11,
    "total_admins": 1,
    "total_products": 45,
    "average_products_per_customer": 4.5
  }
}
```

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Laravel 12
- Node.js and NPM

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd product-management-system/backend
```

2. **Install dependencies:**
```bash
composer install
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Generate application key:**
```bash
php artisan key:generate
```

5. **Run migrations:**
```bash
php artisan migrate
```

6. **Run seeders:**
```bash
php artisan db:seed
```

7. **Start the development server:**
```bash
php artisan serve
```

### Test Credentials

**Admin:**
- Email: admin@example.com
- Password: password123

**Customer 1:**
- Email: customer1@example.com
- Password: password123

**Customer 2:**
- Email: customer2@example.com
- Password: password123

## Features Implemented

### Authentication
- ✅ User Registration
- ✅ User Login
- ✅ User Profile
- ✅ User Logout

### Products
- ✅ Create Product
- ✅ List Products
- ✅ Show Product
- ✅ Update Product
- ✅ Delete Product

### Administration
- ✅ View System Statistics
- ✅ Total Registered Customers
- ✅ Total Products
- ✅ Average Products per Customer

## Testing

Run tests with:
```bash
php artisan test
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## CORS Configuration

CORS is configured in `config/cors.php` to allow requests from the frontend application.

## License

MIT
