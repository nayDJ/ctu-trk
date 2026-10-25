<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'caption' => 'nullable|string',
            'credit' => 'nullable|string|max:255',
            'path' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'is_published' => 'nullable|boolean',
        ];
    }
}
