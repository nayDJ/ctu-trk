<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePpidDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_path' => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'category' => 'required|string|in:berkala,serta_merta,setiap_saat,dikecualikan',
            'is_published' => 'nullable|boolean',
        ];
    }
}
