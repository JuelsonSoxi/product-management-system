<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // RN001
            'password' => 'required|string|min:8|confirmed', // RN002
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email deve ser único.', // RN001
            'password.min' => 'Palavra-passe deve possuir no mínimo 8 caracteres.', // RN002
        ];
    }
}
