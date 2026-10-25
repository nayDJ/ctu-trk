<?php

namespace Tests\Feature\Admin;

use App\Models\Complaint;
use App\Models\ComplaintFile;
use App\Models\InfoRequest;
use App\Models\InfoRequestFile;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CrudFlowFixesTest extends TestCase
{
    use RefreshDatabase;

    public function test_complaint_update_same_status_writes_no_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
        ])->assertRedirect();

        $this->assertDatabaseCount('complaint_histories', 0);
    }

    public function test_complaint_update_same_status_with_note_writes_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
            'note' => 'Catatan tanpa perubahan status',
        ])->assertRedirect();

        $this->assertDatabaseHas('complaint_histories', [
            'complaint_id' => $complaint->id,
            'status' => 'SUBMITTED',
            'note' => 'Catatan tanpa perubahan status',
            'content_link' => null,
            'admin_id' => $admin->id,
        ]);
    }

    public function test_complaint_update_same_status_with_content_link_writes_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
            'content_link' => 'https://example.com/tindak-lanjut',
        ])->assertRedirect();

        $this->assertDatabaseHas('complaint_histories', [
            'complaint_id' => $complaint->id,
            'status' => 'SUBMITTED',
            'note' => null,
            'content_link' => 'https://example.com/tindak-lanjut',
            'admin_id' => $admin->id,
        ]);
    }

    public function test_complaint_follow_up_upload_keeps_note_and_file(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
            'note' => 'Bukti tindak lanjut',
            'follow_up_files' => [UploadedFile::fake()->image('bukti.jpg')],
        ])->assertRedirect();

        $this->assertDatabaseHas('complaint_histories', [
            'complaint_id' => $complaint->id,
            'note' => 'Bukti tindak lanjut',
        ]);

        $file = ComplaintFile::where('complaint_id', $complaint->id)
            ->where('type', 'follow_up')
            ->firstOrFail();

        Storage::disk('public')->assertExists($file->path);
    }

    public function test_complaint_update_changed_status_writes_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'VERIFIED',
            'note' => 'terverifikasi',
        ])->assertRedirect();

        $this->assertDatabaseCount('complaint_histories', 1);
    }

    public function test_info_request_update_same_status_writes_no_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'SUBMITTED',
        ])->assertRedirect();

        $this->assertDatabaseCount('info_request_histories', 0);
    }

    public function test_info_request_update_same_status_with_note_and_link_writes_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'SUBMITTED',
            'note' => 'Catatan tanpa perubahan status',
            'content_link' => 'https://example.com/tindak-lanjut',
        ])->assertRedirect();

        $this->assertDatabaseHas('info_request_histories', [
            'info_request_id' => $infoRequest->id,
            'status' => 'SUBMITTED',
            'note' => 'Catatan tanpa perubahan status',
            'content_link' => 'https://example.com/tindak-lanjut',
            'admin_id' => $admin->id,
        ]);
    }

    public function test_info_request_follow_up_upload_keeps_note_and_file(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'SUBMITTED',
            'note' => 'Bukti tindak lanjut',
            'follow_up_files' => [UploadedFile::fake()->image('bukti.jpg')],
        ])->assertRedirect();

        $this->assertDatabaseHas('info_request_histories', [
            'info_request_id' => $infoRequest->id,
            'note' => 'Bukti tindak lanjut',
        ]);

        $file = InfoRequestFile::where('info_request_id', $infoRequest->id)
            ->where('type', 'follow_up')
            ->firstOrFail();

        Storage::disk('public')->assertExists($file->path);
    }

    public function test_info_request_update_changed_status_writes_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'PROCESSING',
        ])->assertRedirect();

        $this->assertDatabaseCount('info_request_histories', 1);
    }

    public function test_official_store_empty_village_id_saved_as_null(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post('/admin/officials', [
            'name' => 'Pak Lurah',
            'position' => 'Lurah',
            'village_id' => '',
        ])->assertRedirect();

        $this->assertDatabaseHas('officials', ['name' => 'Pak Lurah', 'village_id' => null]);
    }

    public function test_post_store_published_sets_published_at(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post('/admin/posts', [
            'title' => 'Berita Publish',
            'is_published' => true,
        ])->assertRedirect();

        $post = Post::where('title', 'Berita Publish')->firstOrFail();
        $this->assertNotNull($post->published_at);
    }

    public function test_post_update_unpublish_clears_published_at(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $post = Post::factory()->create([
            'author_id' => $admin->id,
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);

        $this->actingAs($admin)->put("/admin/posts/{$post->id}", [
            'title' => $post->title,
            'is_published' => false,
        ])->assertRedirect();

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'published_at' => null]);
    }

    public function test_admin_show_pages_load(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create();
        $infoRequest = InfoRequest::factory()->create();
        $message = Message::create([
            'name' => 'Andi',
            'email' => 'andi@example.com',
            'subject' => 'Halo',
            'body' => 'Isi pesan',
        ]);

        $this->actingAs($admin)->get("/admin/complaints/{$complaint->id}")->assertStatus(200);
        $this->actingAs($admin)->get("/admin/info-requests/{$infoRequest->id}")->assertStatus(200);
        $this->actingAs($admin)->get("/admin/messages/{$message->id}")->assertStatus(200);
    }

    public function test_super_admin_delete_complaint_removes_files(): void
    {
        Storage::fake('public');
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $complaint = Complaint::factory()->create();
        $path = 'complaints/evidence/bukti.jpg';
        Storage::disk('public')->put($path, 'content');
        ComplaintFile::create([
            'complaint_id' => $complaint->id,
            'type' => 'evidence',
            'path' => $path,
            'mime' => 'image/jpeg',
            'size' => 7,
        ]);

        $this->actingAs($superAdmin)->delete("/admin/complaints/{$complaint->id}")
            ->assertRedirect(route('admin.complaints.index'));

        $this->assertDatabaseMissing('complaints', ['id' => $complaint->id]);
        $this->assertDatabaseMissing('complaint_files', ['complaint_id' => $complaint->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_super_admin_delete_info_request_removes_files(): void
    {
        Storage::fake('public');
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $infoRequest = InfoRequest::factory()->create();
        $path = 'info-requests/follow-ups/bukti.pdf';
        Storage::disk('public')->put($path, 'content');
        InfoRequestFile::create([
            'info_request_id' => $infoRequest->id,
            'type' => 'follow_up',
            'path' => $path,
            'mime' => 'application/pdf',
            'size' => 7,
        ]);

        $this->actingAs($superAdmin)->delete("/admin/info-requests/{$infoRequest->id}")
            ->assertRedirect(route('admin.info-requests.index'));

        $this->assertDatabaseMissing('info_requests', ['id' => $infoRequest->id]);
        $this->assertDatabaseMissing('info_request_files', ['info_request_id' => $infoRequest->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_admin_cannot_delete_complaint_or_info_request(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create();
        $infoRequest = InfoRequest::factory()->create();

        $this->actingAs($admin)->delete("/admin/complaints/{$complaint->id}")
            ->assertForbidden();
        $this->actingAs($admin)->delete("/admin/info-requests/{$infoRequest->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('complaints', ['id' => $complaint->id]);
        $this->assertDatabaseHas('info_requests', ['id' => $infoRequest->id]);
    }

    public function test_complaint_content_link_rejects_unsafe_urls(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
            'content_link' => 'javascript:alert(1)',
        ])->assertSessionHasErrors('content_link');

        $this->actingAs($admin)->post("/admin/complaints/{$complaint->id}/update", [
            'status' => 'SUBMITTED',
            'content_link' => 'ftp://example.com/bukti.pdf',
        ])->assertSessionHasErrors('content_link');
    }

    public function test_info_request_content_link_rejects_unsafe_urls(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create(['status' => 'SUBMITTED']);

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'SUBMITTED',
            'content_link' => 'javascript:alert(1)',
        ])->assertSessionHasErrors('content_link');

        $this->actingAs($admin)->post("/admin/info-requests/{$infoRequest->id}/update", [
            'status' => 'SUBMITTED',
            'content_link' => 'ftp://example.com/bukti.pdf',
        ])->assertSessionHasErrors('content_link');
    }
}
