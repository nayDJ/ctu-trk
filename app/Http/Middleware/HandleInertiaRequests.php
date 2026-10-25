<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Models\Message;
use App\Models\Setting;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'role'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'menus' => fn () => Menu::where('context', 'public')
                ->where('is_active', true)
                ->with('children.children')
                ->orderBy('sort_order')
                ->get()
                ->map(fn ($menu) => $menu->only('id', 'label', 'href', 'icon', 'parent_id', 'sort_order'))
                ->toArray(),
            'settings' => fn () => Cache::remember(Setting::CACHE_KEY, 300, fn () => Setting::pluck('value', 'key')->toArray()),
            // ponytail: sidebar hanya untuk konteks admin; publik tidak membayar query ini
            'sidebarMenus' => fn () => ($request->is('admin*') || $request->user())
                ? Menu::where('context', 'admin_sidebar')
                    ->with('children.children')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn ($menu) => $menu->only('id', 'label', 'href', 'icon', 'role', 'sort_order', 'is_active'))
                    ->toArray()
                : [],
            // ponytail: badge sidebar — hanya dihitung di area admin, publik tidak membayar query
            'unreadMessages' => fn () => $request->is('admin*') ? Message::where('is_read', false)->count() : 0,
            'villages' => fn () => Village::where('is_published', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'leader_name', 'description', 'photo'])
                ->toArray(),
        ];
    }
}
