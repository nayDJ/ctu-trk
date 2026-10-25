<?php

namespace App\Modules\Complaint\Enums;

enum ComplaintStatus: string
{
    case SUBMITTED = 'SUBMITTED';
    case VERIFIED = 'VERIFIED';
    case PROCESSING = 'PROCESSING';
    case COMPLETED = 'COMPLETED';
    case REJECTED = 'REJECTED';

    public function label(): string
    {
        return match ($this) {
            self::SUBMITTED => 'Diterima',
            self::VERIFIED => 'Diverifikasi',
            self::PROCESSING => 'Sedang Diproses',
            self::COMPLETED => 'Selesai',
            self::REJECTED => 'Ditolak',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SUBMITTED => 'bg-gray-100 text-gray-700',
            self::VERIFIED => 'bg-info-bg text-info',
            self::PROCESSING => 'bg-warning-bg text-warning',
            self::COMPLETED => 'bg-success-bg text-success',
            self::REJECTED => 'bg-destructive-bg text-destructive',
        };
    }
}
