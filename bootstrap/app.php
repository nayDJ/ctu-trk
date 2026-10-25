<?php

use App\Http\Middleware\AuditMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\SecureHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AuditMiddleware::class,
            SecureHeaders::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        // ponytail: removed encryptCookies(except) — PHP 8.5 ErrorException on static::$neverEncrypt in isDisabled(). Session cookie encryption works fine without exception.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            $code = $response->getStatusCode();

            // ponytail: redirect/validasi tetap ditangani Inertia agar error muncul di form.
            if (($code >= 300 && $code < 400) || $code === 422) {
                return $response;
            }

            if ($request->is('api/*') || $request->expectsJson()) {
                return $response;
            }

            // ponytail: halaman error penuh juga dirender untuk kunjungan langsung, bukan hanya X-Inertia.
            $wantsHtml = $request->header('X-Inertia')
                || str_contains((string) $request->header('Accept'), 'text/html');

            if (! $wantsHtml) {
                return $response;
            }

            // ponytail: hanya 403/404/500 yang punya halaman; sisanya (419/429/503/…) fallback ke 500
            $page = in_array($code, [403, 404, 500], true) ? $code : 500;

            return Inertia::render('errors/'.$page, [
                'status' => $code,
            ])->toResponse($request)->setStatusCode($code);
        });
    })->create();
