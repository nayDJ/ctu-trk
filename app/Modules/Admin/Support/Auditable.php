<?php

namespace App\Modules\Admin\Support;

use App\Models\AuditLog;

trait Auditable
{
    protected function logAudit(string $action, string $entityType, ?int $entityId = null, ?string $note = null): void
    {
        // ponytail: user di-resolve sekali
        $user = auth()->user();
        AuditLog::create([
            'user_id' => $user?->id,
            'role' => $user?->role,
            'action' => $action.($note ? " ({$note})" : ''),
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
