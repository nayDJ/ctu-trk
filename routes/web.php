<?php

use App\Http\Controllers\AuthController;
use App\Modules\Cms\Http\Controllers\CmsPublicController;
use App\Modules\Complaint\Http\Controllers\ComplaintController;
use App\Modules\Content\Http\Controllers\PageController;
use App\Modules\InfoRequest\Http\Controllers\InfoRequestController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [PageController::class, 'home'])->name('home');

// Profile
Route::get('/profil/{section?}', [CmsPublicController::class, 'profile'])->name('profile');

// Information
Route::get('/informasi', [CmsPublicController::class, 'information'])->name('information');
Route::get('/informasi/berita', [CmsPublicController::class, 'beritaIndex'])->name('berita.index');
Route::get('/informasi/berita/{slug}', [CmsPublicController::class, 'beritaShow'])->name('berita.show');
Route::get('/informasi/agenda', [CmsPublicController::class, 'agendaIndex'])->name('agenda.index');
Route::get('/informasi/agenda/{agenda}', [CmsPublicController::class, 'agendaShow'])->whereNumber('agenda')->name('agenda.show');
Route::get('/informasi/galeri', [CmsPublicController::class, 'galeriIndex'])->name('galeri.index');
Route::get('/informasi/dokumen', [CmsPublicController::class, 'documents'])->name('documents');

// Services
Route::get('/layanan', [CmsPublicController::class, 'layananIndex'])->name('layanan.index');
Route::get('/layanan/{slug}', [CmsPublicController::class, 'layananShow'])->name('layanan.show');
Route::get('/formulir', [CmsPublicController::class, 'formulir'])->name('formulir');

// PPID
Route::get('/ppid', [CmsPublicController::class, 'ppidIndex'])->name('ppid.index');
Route::redirect('/ppid/dokumen', '/ppid#dokumen');

// Other pages
Route::get('/sp4n', [CmsPublicController::class, 'sp4nLapor'])->name('sp4n');
Route::get('/kontak', [CmsPublicController::class, 'contact'])->name('contact');
Route::post('/kontak', [CmsPublicController::class, 'submitMessage'])->middleware('throttle:contact-submit')->name('contact.submit');
Route::get('/privasi', [CmsPublicController::class, 'privacy'])->name('privacy');

// Complaints
Route::get('/pengaduan/buat', [ComplaintController::class, 'create'])->name('complaint.create');
Route::post('/pengaduan', [ComplaintController::class, 'store'])->middleware('throttle:complaint-submit')->name('complaint.store');
Route::get('/pengaduan/cek', [ComplaintController::class, 'check'])->name('complaint.check');
Route::post('/pengaduan/cek', [ComplaintController::class, 'doCheck'])->middleware('throttle:status-check')->name('complaint.do-check');
Route::get('/pengaduan/selesai/{ticket}', [ComplaintController::class, 'success'])->name('complaint.success');

// Info Requests
Route::redirect('/permohonan-info/buat', '/pengaduan/buat')->name('info-request.create');
Route::post('/permohonan-info', [InfoRequestController::class, 'store'])->middleware('throttle:complaint-submit')->name('info-request.store');
Route::redirect('/permohonan-info/cek', '/pengaduan/cek')->name('info-request.check');
Route::post('/permohonan-info/cek', [InfoRequestController::class, 'doCheck'])->middleware('throttle:status-check')->name('info-request.do-check');
Route::get('/permohonan-info/selesai/{ticket}', [InfoRequestController::class, 'success'])->name('info-request.success');

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/storage/{path}', function (string $path) {
    $base = realpath(storage_path('app/public'));
    $file = realpath($base.DIRECTORY_SEPARATOR.$path);

    abort_unless(
        $base !== false
        && $file !== false
        && str_starts_with($file, $base.DIRECTORY_SEPARATOR)
        && is_file($file),
        404
    );

    $mime = match (strtolower(pathinfo($file, PATHINFO_EXTENSION))) {
        'jpg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'pdf' => 'application/pdf',
        default => 'application/octet-stream',
    };

    return response()->file($file, [
        'Content-Type' => $mime,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');
