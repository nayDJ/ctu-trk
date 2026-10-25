<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_anonymous')) {
            $this->merge(['is_anonymous' => $this->boolean('is_anonymous') ? 1 : 0]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'reporter_name' => 'required_unless:is_anonymous,1|string|max:255',
            'reporter_phone' => 'required_unless:is_anonymous,1|string|max:255',
            'reporter_email' => 'nullable|email|max:255',
            'reporter_address' => 'nullable|string|max:500',
            'is_anonymous' => 'boolean',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'evidence' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
            'website' => 'nullable|string|max:255',
        ];
    }
}
