<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreMenuRequest;
use App\Models\Menu;
use App\Models\Setting;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    use Auditable;

    public function index()
    {
        $menus = Menu::with('children')->where('context', 'public')->whereNull('parent_id')->orderBy('sort_order')->get();
        // ponytail: parentMenus = baris yang sama tanpa relasi children, hemat 1 query
        $parentMenus = $menus->map(fn (Menu $menu) => (clone $menu)->withoutRelations());
        $sidebarMenus = Menu::where('context', 'admin_sidebar')->orderBy('sort_order')->get();
        $sidebarLogoText = Setting::getValue('sidebar_logo_text', 'Admin');

        return inertia('Admin/Menus/Index', [
            'menus' => $menus,
            'parentMenus' => $parentMenus,
            'sidebarMenus' => $sidebarMenus,
            'sidebarLogoText' => $sidebarLogoText,
        ]);
    }

    public function store(StoreMenuRequest $request)
    {
        $validated = $request->validated();
        $validated['sort_order'] = Menu::max('sort_order') + 1;

        $menu = Menu::create($validated);

        $this->logAudit('create', 'Menu', $menu->id);

        return redirect()->route('admin.menus.index')->with('success', 'Menu berhasil ditambahkan.');
    }

    public function storeSidebar(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'href' => 'required|string|max:255|not_regex:/^\s*javascript:/i',
            'icon' => 'nullable|string|max:255',
            'role' => 'nullable|string',
        ]);

        $validated['context'] = 'admin_sidebar';
        $validated['sort_order'] = Menu::where('context', 'admin_sidebar')->max('sort_order') + 1;
        $validated['is_active'] = true;
        $validated['visibility'] = 'all';

        $menu = Menu::create($validated);

        $this->logAudit('create', 'Menu', $menu->id);

        return back()->with('success', 'Item sidebar berhasil ditambahkan.');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'menus' => 'nullable|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.label' => 'sometimes|string|max:255',
            'menus.*.href' => 'sometimes|string|max:255|not_regex:/^\s*javascript:/i',
            'menus.*.is_active' => 'boolean',
            'menus.*.sort_order' => 'nullable|integer',
            'sidebarMenus' => 'nullable|array',
            'sidebarMenus.*.id' => 'required|exists:menus,id',
            'sidebarMenus.*.label' => 'sometimes|string|max:255',
            'sidebarMenus.*.href' => 'sometimes|string|max:255|not_regex:/^\s*javascript:/i',
            'sidebarMenus.*.icon' => 'nullable|string',
            'sidebarMenus.*.role' => 'nullable|string',
            'sidebarMenus.*.is_active' => 'boolean',
            'sidebarMenus.*.sort_order' => 'nullable|integer',
        ]);

        // ponytail: whereKey()->update tanpa find() — N query, bukan 2N; whereKey Eloquent tetap sentuh updated_at
        if (! empty($validated['menus'])) {
            foreach ($validated['menus'] as $menuData) {
                $update = [];
                foreach (['label', 'href', 'is_active', 'sort_order'] as $field) {
                    if (array_key_exists($field, $menuData)) {
                        $update[$field] = $menuData[$field];
                    }
                }
                Menu::whereKey($menuData['id'])->update($update);
            }
        }

        if (! empty($validated['sidebarMenus'])) {
            foreach ($validated['sidebarMenus'] as $menuData) {
                $update = [];
                foreach (['label', 'href', 'icon', 'role', 'is_active', 'sort_order'] as $field) {
                    if (array_key_exists($field, $menuData)) {
                        $update[$field] = $menuData[$field];
                    }
                }
                Menu::whereKey($menuData['id'])->update($update);
            }
        }

        $this->logAudit('update', 'Menu');

        return back()->with('success', 'Menu berhasil diperbarui.');
    }

    public function updateSidebarSettings(Request $request)
    {
        $validated = $request->validate([
            'sidebar_logo_text' => 'nullable|string|max:255',
        ]);

        Setting::set('sidebar_logo_text', $validated['sidebar_logo_text'] ?? 'Admin');

        $this->logAudit('update', 'Setting');

        return back()->with('success', 'Pengaturan sidebar berhasil disimpan.');
    }

    public function destroySidebar(Menu $menu)
    {
        $menu->delete();

        $this->logAudit('delete', 'Menu', $menu->id);

        return back()->with('success', 'Item sidebar berhasil dihapus.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();

        $this->logAudit('delete', 'Menu', $menu->id);

        return redirect()->route('admin.menus.index')->with('success', 'Menu berhasil dihapus.');
    }
}
