<?php

namespace App\Http\Controllers\Api\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255', // RN006
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0.01', // RN007
            'stock' => 'required|integer|min:0', // RN008
        ]);

        $product = $request->user()->products()->create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    /**
     * List all products for the authenticated user
     */
    public function index(Request $request)
    {
        $products = $request->user()->products()->get();

        return response()->json([
            'products' => $products,
            'total' => $products->count(),
        ]);
    }

    /**
     * Show a specific product
     */
    public function show(Request $request, Product $product)
    {
        // RN009: User can only view their own products
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        // RN010: User can only edit their own products
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255', // RN006
            'description' => 'nullable|string',
            'price' => 'numeric|min:0.01', // RN007
            'stock' => 'integer|min:0', // RN008
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy(Request $request, Product $product)
    {
        // RN011: User can only delete their own products
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
