<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInfoRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'requester_name' => 'required|string|max:255',
            'requester_phone' => 'required|string|max:255',
            'requester_email' => 'nullable|email|max:255',
            'requester_address' => 'nullable|string|max:500',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'info_requested' => 'required|string',
            'website' => 'nullable|string|max:255',
        ];
    }
}
