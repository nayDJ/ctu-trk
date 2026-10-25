<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'estimated_time' => 'nullable|string|max:255',
            'procedure' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'is_primary' => 'nullable|boolean',
        ];
    }
}
