<?php

namespace App\Modules\InfoRequest\Support;

use App\Models\InfoRequest;
use Illuminate\Support\Str;

class TicketGenerator
{
    public static function generate(): string
    {
        do {
            $code = 'IFM-'.strtoupper(Str::random(5));
        } while (InfoRequest::where('ticket', $code)->exists());

        return $code;
    }

    public static function generateTrackingCode(): string
    {
        do {
            $code = 'IFM-'.strtoupper(Str::random(5));
        } while (InfoRequest::where('tracking_code', $code)->exists());

        return $code;
    }
}
