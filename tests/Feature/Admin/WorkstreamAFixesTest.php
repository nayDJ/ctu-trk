<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Complaint;
use App\Models\InfoRequest;
use App\Models\Post;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkstreamAFixesTest extends TestCase
{
    use RefreshDatabase;

    private function superAdmin(): User
    {
        return User::factory()->create(['role' => 'super_admin']);
    }

    public function test_menu_rejects_wrong_context_and_javascript_href(): void
    {
        $response = $this->actingAs($this->superAdmin())->post('/admin/menus', [
            'label' => 'X', 'href' => '/x', 'context' => 'admin',
        ]);
        $response->assertSessionHasErrors('context');

        $response = $this->actingAs(User::factory()->create(['role' => 'super_admin']))->post('/admin/menus', [
            'label' => 'X', 'href' => 'javascript:alert(1)', 'context' => 'public',
        ]);
        $response->assertSessionHasErrors('href');
    }

    public function test_user_sees_masked_complaint_pii_in_json(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $complaint = Complaint::factory()->create([
            'reporter_name' => 'Budi Santoso', 'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com', 'is_anonymous' => false,
        ]);

        $response = $this->actingAs($user)->getJson("/admin/complaints/{$complaint->id}/json");
        $response->assertOk();
        $json = $response->json('complaint');
        $this->assertSame('B*** S******', $json['reporter_name']);
        $this->assertSame('0812********', $json['reporter_phone']);
        $this->assertSame('b***@example.com', $json['reporter_email']);
        $this->assertFalse($response->json('canViewPii'));
    }

    public function test_admin_sees_full_complaint_pii_in_json(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create([
            'reporter_name' => 'Budi Santoso', 'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com', 'is_anonymous' => false,
        ]);

        $response = $this->actingAs($admin)->getJson("/admin/complaints/{$complaint->id}/json");
        $response->assertOk();
        $json = $response->json('complaint');
        $this->assertSame('Budi Santoso', $json['reporter_name']);
        $this->assertSame('081234567890', $json['reporter_phone']);
        $this->assertSame('budi@example.com', $json['reporter_email']);
        $this->assertTrue($response->json('canViewPii'));
    }

    public function test_super_admin_sees_full_complaint_pii_in_json(): void
    {
        $complaint = Complaint::factory()->create([
            'reporter_name' => 'Budi Santoso', 'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com', 'is_anonymous' => false,
        ]);

        $response = $this->actingAs($this->superAdmin())->getJson("/admin/complaints/{$complaint->id}/json");
        $response->assertOk();
        $this->assertSame('Budi Santoso', $response->json('complaint.reporter_name'));
        $this->assertTrue($response->json('canViewPii'));
    }

    public function test_user_sees_masked_info_request_pii_in_json(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $info = InfoRequest::factory()->create([
            'requester_name' => 'Siti Rahma', 'requester_phone' => '081298765432',
            'requester_email' => 'siti@example.com',
        ]);

        $response = $this->actingAs($user)->getJson("/admin/info-requests/{$info->id}/json");
        $response->assertOk();
        $json = $response->json('infoRequest');
        $this->assertSame('S*** R****', $json['requester_name']);
        $this->assertSame('0812********', $json['requester_phone']);
        $this->assertSame('s***@example.com', $json['requester_email']);
        $this->assertFalse($response->json('canViewPii'));
    }

    public function test_user_json_hides_legacy_pii_on_anonymous_complaint(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $complaint = Complaint::factory()->create([
            'is_anonymous' => true,
            'reporter_name' => 'Anonim',
            'reporter_phone' => '-',
            'reporter_email' => 'legacy@example.com',
            'reporter_address' => 'Jl. Lama No. 9',
        ]);

        $response = $this->actingAs($user)->getJson("/admin/complaints/{$complaint->id}/json");
        $response->assertOk();
        $this->assertNull($response->json('complaint.reporter_email'));
        $this->assertNull($response->json('complaint.reporter_address'));
        $this->assertFalse($response->json('canViewPii'));
    }

    public function test_admin_sees_full_info_request_pii_in_json(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $info = InfoRequest::factory()->create([
            'requester_name' => 'Siti Rahma', 'requester_phone' => '081298765432',
            'requester_email' => 'siti@example.com',
        ]);

        $response = $this->actingAs($admin)->getJson("/admin/info-requests/{$info->id}/json");
        $response->assertOk();
        $json = $response->json('infoRequest');
        $this->assertSame('Siti Rahma', $json['requester_name']);
        $this->assertSame('081298765432', $json['requester_phone']);
        $this->assertSame('siti@example.com', $json['requester_email']);
        $this->assertTrue($response->json('canViewPii'));
    }

    public function test_user_cannot_delete_self_or_last_super_admin_or_with_posts(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)->delete("/admin/users/{$admin->id}")
            ->assertSessionHasErrors('user');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);

        $other = User::factory()->create(['role' => 'admin']);
        Post::factory()->create(['author_id' => $other->id]);
        $this->actingAs($admin)->delete("/admin/users/{$other->id}")
            ->assertSessionHasErrors('user');
        $this->assertDatabaseHas('users', ['id' => $other->id]);

        // self-demote guard
        $this->actingAs($admin)->put("/admin/users/{$admin->id}", ['role' => 'admin'])
            ->assertSessionHasErrors('role');
        $this->assertSame('super_admin', $admin->fresh()->role);
    }

    public function test_settings_accepts_profile_keys(): void
    {
        $response = $this->actingAs($this->superAdmin())->put('/admin/settings', [
            'maklumat_pelayanan' => 'Maklumat tes',
            'ppid_deskripsi' => 'Deskripsi PPID',
            'ppid_standar_layanan_judul' => 'Judul standar',
            'ppid_struktur_image' => 'struktur/ppid.jpg',
        ]);
        $response->assertSessionHasNoErrors()->assertSessionHas('success');
    }

    public function test_slug_collision_gets_suffix_and_partial_update_no_crash(): void
    {
        $admin = $this->superAdmin();
        Category::create(['name' => 'Berita', 'slug' => 'berita']);
        $this->actingAs($admin)->post('/admin/categories', ['name' => 'Berita'])
            ->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', ['slug' => 'berita-2']);

        $service = Service::create(['name' => 'KTP', 'slug' => 'ktp']);
        $this->actingAs($admin)->put("/admin/services/{$service->id}", ['description' => 'hanya deskripsi'])
            ->assertSessionHasNoErrors();
        $this->assertSame('ktp', $service->fresh()->slug);
    }

    public function test_honeypot_filled_returns_fake_success(): void
    {
        $category = Category::create(['name' => 'Umum', 'slug' => 'umum']);
        $response = $this->post('/pengaduan', [
            'category_id' => $category->id, 'title' => 'T', 'description' => 'D',
            'reporter_name' => 'A', 'reporter_phone' => '08', 'website' => 'bot',
        ]);
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('complaints', 0);
    }
}
