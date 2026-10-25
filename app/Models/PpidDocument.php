<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpidDocument extends Model
{
    protected $fillable = ['title', 'description', 'file_path', 'category', 'is_published'];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
