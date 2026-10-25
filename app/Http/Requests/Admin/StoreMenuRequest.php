<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => 'required|string|max:255',
            'href' => 'required|string|max:255|not_regex:/^\s*javascript:/i',
            'icon' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'context' => 'required|in:public,admin_sidebar',
            'visibility' => 'nullable|string|max:50',
        ];
    }
}
