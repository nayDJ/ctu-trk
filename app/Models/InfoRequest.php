<?php

namespace App\Models;

use App\Modules\InfoRequest\Enums\InfoRequestStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InfoRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket', 'tracking_code', 'requester_name', 'requester_phone',
        'requester_email', 'requester_address', 'title', 'description',
        'info_requested', 'status',
    ];

    protected $casts = [
        'status' => InfoRequestStatus::class,
    ];

    public function histories(): HasMany
    {
        return $this->hasMany(InfoRequestHistory::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(InfoRequestFile::class);
    }
}
