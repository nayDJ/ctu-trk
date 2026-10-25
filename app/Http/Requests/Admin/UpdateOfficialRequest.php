<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfficialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'village_id' => 'nullable|exists:villages,id',
            'sort_order' => 'nullable|integer',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
