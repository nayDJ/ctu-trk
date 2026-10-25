<?php

namespace App\Http\Requests\Admin;

use App\Modules\InfoRequest\Enums\InfoRequestStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInfoRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:'.implode(',', array_column(InfoRequestStatus::cases(), 'value')),
            'note' => 'nullable|string|max:1000',
            'content_link' => 'nullable|url:http,https|max:500',
            'follow_up_files' => 'nullable|array|max:5',
            'follow_up_files.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ];
    }
}
