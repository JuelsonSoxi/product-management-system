<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles if using Spatie roles
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'customer']);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );
        $admin->assignRole('admin');

        // Create sample customer users
        $customer1 = User::firstOrCreate(
            ['email' => 'customer1@example.com'],
            [
                'name' => 'Customer One',
                'password' => Hash::make('password123'),
                'role' => 'customer',
            ]
        );
        $customer1->assignRole('customer');

        $customer2 = User::firstOrCreate(
            ['email' => 'customer2@example.com'],
            [
                'name' => 'Customer Two',
                'password' => Hash::make('password123'),
                'role' => 'customer',
            ]
        );
        $customer2->assignRole('customer');
    }
}
