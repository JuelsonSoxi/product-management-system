<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get system statistics
     * RN004: Only admins can view system statistics
     */
    public function stats(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $totalUsers = User::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalProducts = Product::count();

        return response()->json([
            'statistics' => [
                'total_registered_clients' => $totalCustomers,
                'total_users' => $totalUsers,
                'total_admins' => $totalAdmins,
                'total_products' => $totalProducts,
                'average_products_per_customer' => $totalCustomers > 0 
                    ? round($totalProducts / $totalCustomers, 2) 
                    : 0,
            ],
        ]);
    }
}
