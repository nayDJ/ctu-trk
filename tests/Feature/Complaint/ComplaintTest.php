<?php

namespace Tests\Feature\Complaint;

use App\Models\Category;
use App\Models\Complaint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ComplaintTest extends TestCase
{
    use RefreshDatabase;

    public function test_complaint_can_be_created(): void
    {
        $category = Category::factory()->create();

        $response = $this->post('/pengaduan', [
            'category_id' => $category->id,
            'reporter_name' => 'Budi Santoso',
            'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com',
            'reporter_address' => 'Jl. Contoh No. 1',
            'is_anonymous' => false,
            'title' => 'Jalan Rusak',
            'description' => 'Jalan di depan RT 05 rusak parah.',
            'location' => 'Jl. Merdeka, RT 05',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('complaints', [
            'title' => 'Jalan Rusak',
            'is_anonymous' => false,
        ]);
    }

    public function test_anonymous_complaint_can_be_created(): void
    {
        $category = Category::factory()->create();

        $response = $this->post('/pengaduan', [
            'category_id' => $category->id,
            'is_anonymous' => true,
            'reporter_email' => 'rahasia@example.com',
            'reporter_address' => 'Jl. Rahasia No. 1',
            'title' => 'Lampu Jalan Mati',
            'description' => 'Lampu jalan di RT 03 sudah 3 hari mati.',
            'location' => 'Jl. Sudirman, RT 03',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('complaints', [
            'title' => 'Lampu Jalan Mati',
            'reporter_name' => 'Anonim',
            'reporter_email' => null,
            'reporter_address' => null,
        ]);
    }

    public function test_non_anonymous_complaint_requires_reporter_identity(): void
    {
        $category = Category::factory()->create();

        $response = $this->post('/pengaduan', [
            'category_id' => $category->id,
            'is_anonymous' => false,
            'title' => 'Jalan Rusak',
            'description' => 'Jalan di depan RT 05 rusak parah.',
        ]);

        $response->assertSessionHasErrors(['reporter_name', 'reporter_phone']);
        $this->assertDatabaseCount('complaints', 0);
    }

    public function test_complaint_evidence_upload_is_stored(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->post('/pengaduan', [
            'category_id' => $category->id,
            'reporter_name' => 'Budi Santoso',
            'reporter_phone' => '081234567890',
            'is_anonymous' => false,
            'title' => 'Jalan Rusak',
            'description' => 'Jalan di depan RT 05 rusak parah.',
            'evidence' => UploadedFile::fake()->image('bukti.jpg'),
        ]);

        $response->assertRedirect();
        $complaint = Complaint::where('title', 'Jalan Rusak')->firstOrFail();
        $file = $complaint->files()->firstOrFail();

        $this->assertSame('evidence', $file->type);
        Storage::disk('public')->assertExists($file->path);
    }

    public function test_complaint_status_can_be_checked(): void
    {
        $complaint = Complaint::factory()->create();

        $response = $this->post('/pengaduan/cek', [
            'ticket' => $complaint->ticket,
        ]);

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Public/Complaint/Result')
            ->where('complaint.id', $complaint->id)
            ->missing('complaint.reporter_name')
            ->missing('complaint.reporter_phone')
            ->missing('complaint.reporter_email')
            ->missing('complaint.reporter_address')
            ->missing('complaint.tracking_code')
        );
    }

    public function test_invalid_ticket_returns_error(): void
    {
        $response = $this->post('/pengaduan/cek', [
            'ticket' => 'CTU-XXXXX',
        ]);

        $response->assertSessionHasErrors('ticket');
    }

    public function test_complaint_success_page_loads(): void
    {
        $complaint = Complaint::factory()->create();

        $response = $this->get("/pengaduan/selesai/{$complaint->ticket}");

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Public/Complaint/Success')
            ->where('ticket', $complaint->ticket)
            ->missing('tracking_code')
        );
    }
}
