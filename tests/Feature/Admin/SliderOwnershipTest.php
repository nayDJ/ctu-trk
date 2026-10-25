<?php

namespace Tests\Feature\Admin;

use App\Models\Slider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SliderOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_only_sees_own_sliders_and_creator_name(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);

        $ownSlider = Slider::create([
            'title' => 'Slider Milik Sendiri',
            'image' => 'sliders/own.jpg',
            'created_by' => $user->id,
        ]);
        Slider::create([
            'title' => 'Slider Milik Orang Lain',
            'image' => 'sliders/other.jpg',
            'created_by' => $otherUser->id,
        ]);

        $this->actingAs($user)->get('/admin/sliders')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Sliders/Index')
                ->has('sliders.data', 1)
                ->where('sliders.data.0.id', $ownSlider->id)
                ->where('sliders.data.0.creator.name', $user->name)
                ->missing('sliders.data.0.creator.email')
                ->missing('sliders.data.0.creator.role')
            );
    }

    public function test_admin_sees_all_sliders(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $ownerA = User::factory()->create(['role' => 'user']);
        $ownerB = User::factory()->create(['role' => 'user']);

        Slider::create([
            'title' => 'Slider A',
            'image' => 'sliders/a.jpg',
            'created_by' => $ownerA->id,
        ]);
        Slider::create([
            'title' => 'Slider B',
            'image' => 'sliders/b.jpg',
            'created_by' => $ownerB->id,
        ]);

        $this->actingAs($admin)->get('/admin/sliders')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Sliders/Index')
                ->has('sliders.data', 2)
            );
    }
}
