<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agenda extends Model
{
    protected $fillable = ['title', 'description', 'starts_at', 'ends_at', 'location', 'image_path', 'is_published', 'created_by'];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_published' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    #[Scope]
    protected function upcomingOrOngoing(Builder $query): void
    {
        $query->where(function (Builder $query) {
            $query->where('starts_at', '>=', now())
                ->orWhere('ends_at', '>=', now());
        });
    }

    #[Scope]
    protected function past(Builder $query): void
    {
        $query->where('starts_at', '<', now())
            ->where(function (Builder $query) {
                $query->whereNull('ends_at')
                    ->orWhere('ends_at', '<', now());
            });
    }
}
