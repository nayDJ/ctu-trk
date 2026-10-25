<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Village extends Model
{
    protected $fillable = ['name', 'leader_name', 'description', 'photo', 'sort_order', 'is_published'];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function officials(): HasMany
    {
        return $this->hasMany(Official::class);
    }
}
