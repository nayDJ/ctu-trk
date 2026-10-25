<?php

namespace Tests\Feature\Admin;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MenuBulkUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_reorder_menus_without_find_selects(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $menus = collect(range(1, 3))->map(fn ($i) => Menu::create([
            'label' => "Menu {$i}", 'href' => "/m{$i}", 'context' => 'public', 'sort_order' => $i, 'is_active' => true, 'visibility' => 'all',
        ]));

        DB::enableQueryLog();
        $response = $this->actingAs($admin)->put('/admin/menus', [
            'menus' => $menus->reverse()->values()->map(fn ($m, $i) => [
                'id' => $m->id, 'sort_order' => $i + 1, 'is_active' => true,
            ])->all(),
        ]);
        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertSessionHas('success');

        // urutan tertukar sesuai payload
        $this->assertSame(
            $menus->reverse()->pluck('id')->all(),
            Menu::where('context', 'public')->orderBy('sort_order')->pluck('id')->all()
        );

        // tanpa find(): hanya exists() validasi (<=3 select) + 3 update, bukan 2N
        $selects = array_filter($queries, fn ($q) => str_contains($q['query'], 'menus') && str_starts_with(ltrim($q['query']), 'select'));
        $updates = array_filter($queries, fn ($q) => str_starts_with(ltrim($q['query']), 'update'));
        $this->assertLessThanOrEqual(3, count($selects));
        $this->assertCount(3, $updates);
    }
}
