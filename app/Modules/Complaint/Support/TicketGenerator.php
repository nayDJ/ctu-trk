<?php

namespace App\Modules\Complaint\Support;

use App\Models\Complaint;
use Illuminate\Support\Str;

class TicketGenerator
{
    public static function generate(): string
    {
        do {
            $code = 'CTU-'.strtoupper(Str::random(5));
        } while (Complaint::where('ticket', $code)->exists());

        return $code;
    }

    public static function generateTrackingCode(): string
    {
        do {
            $code = 'TRK-'.str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (Complaint::where('tracking_code', $code)->exists());

        return $code;
    }
}
