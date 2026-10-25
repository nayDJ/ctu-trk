<?php

namespace Tests\Feature\Public;

use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VillageSharedPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_villages_include_leader_and_photo(): void
    {
        Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'description' => 'Deskripsi Juata Laut',
            'photo' => 'villages/juata-laut.jpg',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        $this->get('/profil')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Profile')
                ->where('villages.0.name', 'Juata Laut')
                ->where('villages.0.leader_name', 'Budi')
                ->where('villages.0.description', 'Deskripsi Juata Laut')
                ->where('villages.0.photo', 'villages/juata-laut.jpg')
            );
    }

    public function test_unpublished_village_is_not_shared(): void
    {
        Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'photo' => 'villages/juata-laut.jpg',
            'is_published' => false,
        ]);

        $this->get('/profil')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('villages', [])
            );
    }
}
