<?php

namespace Tests\Feature\Admin;

use App\Models\Complaint;
use App\Models\InfoRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PiiVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_sees_masked_complaint_pii_on_show_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $complaint = Complaint::factory()->create([
            'reporter_name' => 'Budi Santoso',
            'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com',
            'reporter_address' => 'Jl. Contoh No. 1',
            'is_anonymous' => false,
        ]);

        $this->actingAs($user)->get("/admin/complaints/{$complaint->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Complaints/Show')
                ->where('complaint.reporter_name', 'B*** S******')
                ->where('complaint.reporter_phone', '0812********')
                ->where('complaint.reporter_email', 'b***@example.com')
                ->where('complaint.reporter_address', mask_address('Jl. Contoh No. 1'))
                ->where('canViewPii', false)
                ->where('canManage', false)
            );
    }

    public function test_admin_sees_full_complaint_pii_on_show_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $complaint = Complaint::factory()->create([
            'reporter_name' => 'Budi Santoso',
            'reporter_phone' => '081234567890',
            'reporter_email' => 'budi@example.com',
            'reporter_address' => 'Jl. Contoh No. 1',
            'is_anonymous' => false,
        ]);

        $this->actingAs($admin)->get("/admin/complaints/{$complaint->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Complaints/Show')
                ->where('complaint.reporter_name', 'Budi Santoso')
                ->where('complaint.reporter_phone', '081234567890')
                ->where('complaint.reporter_email', 'budi@example.com')
                ->where('complaint.reporter_address', 'Jl. Contoh No. 1')
                ->where('canViewPii', true)
                ->where('canManage', true)
            );
    }

    public function test_regular_user_sees_masked_info_request_pii_on_show_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $infoRequest = InfoRequest::factory()->create([
            'requester_name' => 'Siti Rahma',
            'requester_phone' => '081298765432',
            'requester_email' => 'siti@example.com',
            'requester_address' => 'Jl. Melati No. 5',
        ]);

        $this->actingAs($user)->get("/admin/info-requests/{$infoRequest->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/InfoRequests/Show')
                ->where('infoRequest.requester_name', 'S*** R****')
                ->where('infoRequest.requester_phone', '0812********')
                ->where('infoRequest.requester_email', 's***@example.com')
                ->where('infoRequest.requester_address', mask_address('Jl. Melati No. 5'))
                ->where('canViewPii', false)
                ->where('canManage', false)
            );
    }

    public function test_admin_sees_full_info_request_pii_on_show_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $infoRequest = InfoRequest::factory()->create([
            'requester_name' => 'Siti Rahma',
            'requester_phone' => '081298765432',
            'requester_email' => 'siti@example.com',
            'requester_address' => 'Jl. Melati No. 5',
        ]);

        $this->actingAs($admin)->get("/admin/info-requests/{$infoRequest->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/InfoRequests/Show')
                ->where('infoRequest.requester_name', 'Siti Rahma')
                ->where('infoRequest.requester_phone', '081298765432')
                ->where('infoRequest.requester_email', 'siti@example.com')
                ->where('infoRequest.requester_address', 'Jl. Melati No. 5')
                ->where('canViewPii', true)
                ->where('canManage', true)
            );
    }
}
