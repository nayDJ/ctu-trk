<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = ['user_id', 'role', 'action', 'entity_type', 'entity_id', 'ip_address', 'user_agent'];

    public $timestamps = false;

    protected static function booted(): void
    {
        static::creating(function (AuditLog $log) {
            $log->created_at = now();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
