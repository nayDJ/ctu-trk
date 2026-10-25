<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = AuditLog::with('user');

        if ($user->role !== 'super_admin') {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id);
                if ($user->role === 'admin') {
                    $q->orWhereIn('role', ['user', null]);
                }
            });
        }

        if ($search = $request->input('search')) {
            $query->where(fn ($q) => $q->where('action', 'like', "%{$search}%")->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")));
        }

        $logs = $query->latest('created_at')->paginate(30)->withQueryString();

        return inertia('Admin/AuditLogs/Index', ['auditLogs' => $logs, 'filters' => ['search' => $request->input('search', '')]]);
    }
}
