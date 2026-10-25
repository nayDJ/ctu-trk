<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'requirements', 'estimated_time', 'procedure', 'is_published', 'is_primary', 'created_by'];

    protected $casts = [
        'is_published' => 'boolean',
        'is_primary' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
