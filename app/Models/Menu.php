<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    protected $fillable = ['label', 'href', 'icon', 'parent_id', 'context', 'sort_order', 'is_active', 'visibility', 'role'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('sort_order');
    }

    public function getRolesAttribute(): array
    {
        return $this->attributes['role'] ? array_filter(explode(',', $this->attributes['role'])) : [];
    }
}
