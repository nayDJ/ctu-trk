<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfoRequestFile extends Model
{
    protected $fillable = ['info_request_id', 'type', 'path', 'mime', 'size'];

    public function infoRequest(): BelongsTo
    {
        return $this->belongsTo(InfoRequest::class);
    }
}
