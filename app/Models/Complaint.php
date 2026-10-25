<?php

namespace App\Models;

use App\Modules\Complaint\Enums\ComplaintStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket', 'tracking_code', 'category_id', 'reporter_name', 'reporter_phone',
        'reporter_email', 'reporter_address', 'is_anonymous', 'title', 'description',
        'location', 'status',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'status' => ComplaintStatus::class,
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ComplaintHistory::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(ComplaintFile::class);
    }
}
