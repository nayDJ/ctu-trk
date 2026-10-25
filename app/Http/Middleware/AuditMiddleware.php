<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // ponytail: hanya untuk admin/* — lewati lebih dulu agar hit publik tak tersentuh
        if (! $request->is('admin', 'admin/*')) {
            return $next($request);
        }

        $response = $next($request);

        if ($request->user() && $request->isMethod('POST')) {
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => $request->route()->getName() ?? $request->path(),
                'entity_type' => null,
                'entity_id' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $response;
    }
}
