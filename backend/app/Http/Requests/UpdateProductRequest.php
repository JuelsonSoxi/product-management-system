<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255', // RN006
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0.01', // RN007
            'stock' => 'sometimes|integer|min:0', // RN008
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nome do produto é obrigatório.', // RN006
            'price.min' => 'Preço deve ser maior que zero.', // RN007
            'stock.min' => 'Stock não pode ser negativo.', // RN008
        ];
    }
}
