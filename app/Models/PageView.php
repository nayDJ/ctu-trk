<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $fillable = ['path', 'ip_address', 'user_agent'];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::creating(function (PageView $view) {
            $view->created_at = now();
        });
    }
}
