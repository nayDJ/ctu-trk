<?php

namespace App\Modules\InfoRequest\Enums;

enum InfoRequestStatus: string
{
    case SUBMITTED = 'SUBMITTED';
    case PROCESSING = 'PROCESSING';
    case COMPLETED = 'COMPLETED';
    case REJECTED = 'REJECTED';

    public function label(): string
    {
        return match ($this) {
            self::SUBMITTED => 'Diterima',
            self::PROCESSING => 'Sedang Diproses',
            self::COMPLETED => 'Selesai',
            self::REJECTED => 'Ditolak',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SUBMITTED => 'bg-gray-100 text-gray-700',
            self::PROCESSING => 'bg-warning-bg text-warning',
            self::COMPLETED => 'bg-success-bg text-success',
            self::REJECTED => 'bg-destructive-bg text-destructive',
        };
    }
}
