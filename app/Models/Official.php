<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Official extends Model
{
    protected $fillable = ['name', 'position', 'photo', 'village_id', 'sort_order'];

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }
}
