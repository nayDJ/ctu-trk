<?php

namespace Tests\Feature\Admin;

use App\Models\Official;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VillageLeaderSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_storing_village_with_leader_creates_one_official(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post('/admin/villages', [
                'name' => 'Juata Laut',
                'leader_name' => 'Budi',
                'is_published' => true,
            ])
            ->assertRedirect(route('admin.villages.index'));

        $village = Village::where('name', 'Juata Laut')->firstOrFail();

        $this->assertDatabaseCount('officials', 1);
        $this->assertDatabaseHas('officials', [
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Lurah',
        ]);
    }

    public function test_updating_village_twice_does_not_duplicate_leader(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post('/admin/villages', [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ]);

        $village = Village::where('name', 'Juata Laut')->firstOrFail();

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->assertDatabaseCount('officials', 1);
    }

    public function test_updating_leader_name_updates_existing_official(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $village = Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ]);
        $official = Official::create([
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Lurah',
        ]);

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi Baru',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->assertDatabaseCount('officials', 1);
        $this->assertDatabaseHas('officials', [
            'id' => $official->id,
            'village_id' => $village->id,
            'name' => 'Budi Baru',
            'position' => 'Kepala Lurah',
        ]);
    }

    public function test_clearing_leader_name_removes_linked_official(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $village = Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ]);
        Official::create([
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Lurah',
        ]);

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => '',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->assertDatabaseCount('officials', 0);
    }

    public function test_manual_leader_without_village_is_adopted(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $village = Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ]);
        $official = Official::create([
            'village_id' => null,
            'name' => 'Budi',
            'position' => 'Lurah',
        ]);

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->assertDatabaseCount('officials', 1);
        $this->assertDatabaseHas('officials', [
            'id' => $official->id,
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Lurah',
        ]);
    }

    public function test_linked_leader_duplicates_are_removed_and_photo_is_preserved(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $village = Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ]);
        $withoutPhoto = Official::create([
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Lurah',
        ]);
        $withPhoto = Official::create([
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Desa',
            'photo' => 'officials/budi.jpg',
        ]);

        $this->actingAs($admin)->put("/admin/villages/{$village->id}", [
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'is_published' => true,
        ])->assertRedirect(route('admin.villages.index'));

        $this->assertDatabaseCount('officials', 1);
        $this->assertDatabaseHas('officials', [
            'id' => $withPhoto->id,
            'village_id' => $village->id,
            'name' => 'Budi',
            'position' => 'Kepala Lurah',
            'photo' => 'officials/budi.jpg',
        ]);
        $this->assertDatabaseMissing('officials', ['id' => $withoutPhoto->id]);
    }
}
