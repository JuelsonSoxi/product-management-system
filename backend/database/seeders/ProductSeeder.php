<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get sample customers
        $customer1 = User::where('email', 'customer1@example.com')->first();
        $customer2 = User::where('email', 'customer2@example.com')->first();

        if ($customer1) {
            Product::create([
                'user_id' => $customer1->id,
                'name' => 'Laptop Dell XPS 13',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'stock' => 5,
            ]);

            Product::create([
                'user_id' => $customer1->id,
                'name' => 'Wireless Keyboard',
                'description' => 'Ergonomic wireless keyboard',
                'price' => 79.99,
                'stock' => 15,
            ]);
        }

        if ($customer2) {
            Product::create([
                'user_id' => $customer2->id,
                'name' => 'USB-C Hub',
                'description' => 'Multi-port USB-C hub with HDMI',
                'price' => 49.99,
                'stock' => 20,
            ]);

            Product::create([
                'user_id' => $customer2->id,
                'name' => 'External SSD 1TB',
                'description' => 'Fast external solid state drive',
                'price' => 149.99,
                'stock' => 8,
            ]);
        }
    }
}
