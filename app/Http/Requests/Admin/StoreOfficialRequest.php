<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfficialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'village_id' => 'nullable|exists:villages,id',
            'sort_order' => 'nullable|integer',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
