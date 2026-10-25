<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Complaint;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_loads(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_admin_statistics_loads(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/admin/statistik');

        $response->assertStatus(200);
    }

    public function test_admin_complaints_page_loads(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/admin/complaints');

        $response->assertStatus(200);
    }

    public function test_admin_categories_page_loads(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/admin/categories');

        $response->assertStatus(200);
    }

    public function test_admin_category_can_be_created(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->post('/admin/categories', [
            'name' => 'Infrastruktur',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', ['name' => 'Infrastruktur']);
    }

    public function test_admin_category_can_be_deleted(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();

        $response = $this->actingAs($user)->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_category_in_use_cannot_be_deleted(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);
        $category = Category::factory()->create();
        Complaint::factory()->for($category)->create();

        $response = $this->actingAs($user)
            ->from('/admin/categories')
            ->delete("/admin/categories/{$category->id}");

        $response->assertRedirect('/admin/categories')
            ->assertSessionHasErrors('category');
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_admin_receives_unread_message_count_for_sidebar_badge(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        Message::create(['name' => 'Warga', 'email' => 'warga@example.com', 'subject' => 'Halo', 'body' => 'Pesan', 'is_read' => false]);
        Message::create(['name' => 'Warga 2', 'email' => 'warga2@example.com', 'subject' => 'Halo', 'body' => 'Pesan', 'is_read' => true]);

        $response = $this->actingAs($user)->get('/admin');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->where('unreadMessages', 1));
    }

    public function test_unauthenticated_user_cannot_access_admin(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }

    public function test_super_admin_can_access_users_page(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($user)->get('/admin/users');

        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_users_page(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/admin/users');

        $response->assertStatus(403);
    }
}
