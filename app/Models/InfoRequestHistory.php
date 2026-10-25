<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfoRequestHistory extends Model
{
    protected $fillable = ['info_request_id', 'status', 'note', 'content_link', 'admin_id'];

    public function infoRequest(): BelongsTo
    {
        return $this->belongsTo(InfoRequest::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
