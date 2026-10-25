<?php

use App\Modules\Admin\Http\Controllers\AccountController;
use App\Modules\Admin\Http\Controllers\AgendaController;
use App\Modules\Admin\Http\Controllers\AuditLogController;
use App\Modules\Admin\Http\Controllers\CategoryController;
use App\Modules\Admin\Http\Controllers\ComplaintController;
use App\Modules\Admin\Http\Controllers\DashboardController;
use App\Modules\Admin\Http\Controllers\GalleryController;
use App\Modules\Admin\Http\Controllers\InfoRequestController;
use App\Modules\Admin\Http\Controllers\MenuController;
use App\Modules\Admin\Http\Controllers\MessageController;
use App\Modules\Admin\Http\Controllers\OfficialController;
use App\Modules\Admin\Http\Controllers\PostController;
use App\Modules\Admin\Http\Controllers\PpidDocumentController;
use App\Modules\Admin\Http\Controllers\ProfileAdminController;
use App\Modules\Admin\Http\Controllers\ServiceController;
use App\Modules\Admin\Http\Controllers\SettingController;
use App\Modules\Admin\Http\Controllers\SliderController;
use App\Modules\Admin\Http\Controllers\StatisticsController;
use App\Modules\Admin\Http\Controllers\UserController;
use App\Modules\Admin\Http\Controllers\VillageController;
use Illuminate\Support\Facades\Route;

// All authenticated roles: super_admin, admin, user
Route::middleware(['auth', 'role:super_admin,admin,user'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Akun sendiri (semua role)
    Route::get('akun', [AccountController::class, 'index'])->name('account.index');
    Route::put('akun/password', [AccountController::class, 'updatePassword'])->name('account.password');

    // Statistics
    Route::get('statistik', [StatisticsController::class, 'index'])->name('statistics');
    Route::get('statistik/export', [StatisticsController::class, 'export'])->name('statistics.export');

    // Posts (CMS) — user: own content only; admin/super_admin: all
    Route::resource('posts', PostController::class)->except(['show', 'create', 'edit']);
    Route::patch('/posts/{post}/publish', [PostController::class, 'publish'])->name('posts.publish');

    // Agendas — user: own content only; admin/super_admin: all
    Route::resource('agendas', AgendaController::class)->except(['show', 'create', 'edit']);
    Route::patch('/agendas/{agenda}/publish', [AgendaController::class, 'publish'])->name('agendas.publish');

    // Galleries — user: own content only; admin/super_admin: all
    Route::resource('galleries', GalleryController::class)->except(['show', 'create', 'edit']);
    Route::patch('/galleries/{gallery}/publish', [GalleryController::class, 'publish'])->name('galleries.publish');

    // Sliders — user: own content only; admin/super_admin: all
    Route::resource('sliders', SliderController::class)->except(['show', 'create', 'edit']);
    Route::patch('/sliders/{slider}/publish', [SliderController::class, 'publish'])->name('sliders.publish');

    // Complaints — read for all; update/delete for admin+
    Route::get('complaints', [ComplaintController::class, 'index'])->name('complaints.index');
    Route::get('complaints/{complaint}/json', [ComplaintController::class, 'showJson'])->name('complaints.json');
    Route::get('complaints/{complaint}', [ComplaintController::class, 'show'])->name('complaints.show');

    // Info Requests — read for all; update/delete for admin+
    Route::get('info-requests', [InfoRequestController::class, 'index'])->name('info-requests.index');
    Route::get('info-requests/{info_request}/json', [InfoRequestController::class, 'showJson'])->name('info-requests.json');
    Route::get('info-requests/{info_request}', [InfoRequestController::class, 'show'])->name('info-requests.show');

    // Messages — read for all; markRead/delete for admin+
    Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('messages/{message}/json', [MessageController::class, 'showJson'])->name('messages.json');
    Route::get('messages/{message}', [MessageController::class, 'show'])->name('messages.show');
});

// Admin + Super Admin routes
Route::middleware(['auth', 'role:super_admin,admin'])->prefix('admin')->name('admin.')->group(function () {
    // Categories — full CRUD
    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
    Route::patch('categories/{category}/toggle', [CategoryController::class, 'toggle'])->name('categories.toggle');

    // Services — full CRUD
    Route::resource('services', ServiceController::class)->except(['show', 'create', 'edit']);
    Route::patch('/services/{service}/publish', [ServiceController::class, 'publish'])->name('services.publish');

    // Officials — full CRUD
    Route::resource('officials', OfficialController::class)->except(['show', 'create', 'edit']);

    // Villages — full CRUD
    Route::resource('villages', VillageController::class)->except(['show', 'create', 'edit']);
    Route::patch('/villages/{village}/publish', [VillageController::class, 'publish'])->name('villages.publish');

    // PPID Documents — full CRUD
    Route::resource('ppid-documents', PpidDocumentController::class)->except(['show', 'create', 'edit']);
    Route::patch('/ppid-documents/{ppid_document}/publish', [PpidDocumentController::class, 'publish'])->name('ppid-documents.publish');

    // Complaints — update
    Route::post('complaints/{complaint}/update', [ComplaintController::class, 'update'])->name('complaints.update');

    // Info Requests — update
    Route::post('info-requests/{info_request}/update', [InfoRequestController::class, 'update'])->name('info-requests.update');

    // Messages — mark read
    Route::patch('messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.read');

    // Audit Logs — read
    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

    // Menus — CRUD (delete restricted to super_admin via middleware)
    Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
    Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
    Route::post('menus/sidebar', [MenuController::class, 'storeSidebar'])->name('menus.sidebar.store');
    Route::put('menus', [MenuController::class, 'update'])->name('menus.update');
    Route::put('menus/sidebar/settings', [MenuController::class, 'updateSidebarSettings'])->name('menus.sidebar.settings');
    Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy')->middleware('role:super_admin');
    Route::delete('menus/sidebar/{menu}', [MenuController::class, 'destroySidebar'])->name('menus.sidebar.destroy')->middleware('role:super_admin');
});

// Super Admin only routes
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    // Users — full CRUD
    Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);

    // Profile & Settings
    Route::get('profil', [ProfileAdminController::class, 'index'])->name('profile.index');
    Route::put('profil', [ProfileAdminController::class, 'update'])->name('profile.update');
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

    // Delete routes — complaints, info-requests, messages
    Route::delete('complaints/{complaint}', [ComplaintController::class, 'destroy'])->name('complaints.destroy');
    Route::delete('info-requests/{info_request}', [InfoRequestController::class, 'destroy'])->name('info-requests.destroy');
    Route::delete('messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
});
