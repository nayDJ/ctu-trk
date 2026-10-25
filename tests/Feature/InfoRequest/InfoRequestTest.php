<?php

namespace Tests\Feature\InfoRequest;

use App\Models\InfoRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InfoRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_info_request_can_be_created(): void
    {
        $response = $this->post('/permohonan-info', [
            'requester_name' => 'Siti Rahma',
            'requester_phone' => '081298765432',
            'requester_email' => 'siti@example.com',
            'requester_address' => 'Jl. Melati No. 5',
            'title' => 'Permohonan Data Statistik',
            'description' => 'Mohon data statistik kecamatan.',
            'info_requested' => 'Data jumlah penduduk per kelurahan.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('ticket');
        $response->assertSessionMissing('tracking_code');

        $infoRequest = InfoRequest::firstOrFail();

        $this->assertDatabaseHas('info_requests', [
            'id' => $infoRequest->id,
            'requester_name' => 'Siti Rahma',
            'status' => 'SUBMITTED',
        ]);
        $this->assertDatabaseHas('info_request_histories', [
            'info_request_id' => $infoRequest->id,
            'status' => 'SUBMITTED',
        ]);
    }

    public function test_info_request_honeypot_does_not_save_data(): void
    {
        $response = $this->post('/permohonan-info', [
            'requester_name' => 'Siti Rahma',
            'requester_phone' => '081298765432',
            'title' => 'Permohonan Data',
            'info_requested' => 'Data statistik',
            'website' => 'bot',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseCount('info_requests', 0);
    }

    public function test_info_request_requires_required_fields(): void
    {
        $response = $this->post('/permohonan-info', []);

        $response->assertSessionHasErrors([
            'requester_name',
            'requester_phone',
            'title',
            'info_requested',
        ]);
    }

    public function test_info_request_status_can_be_checked(): void
    {
        $infoRequest = InfoRequest::factory()->create();

        $response = $this->post('/permohonan-info/cek', [
            'ticket' => $infoRequest->ticket,
        ]);

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Public/InfoRequest/Result')
            ->where('infoRequest.id', $infoRequest->id)
            ->missing('infoRequest.requester_name')
            ->missing('infoRequest.requester_phone')
            ->missing('infoRequest.requester_email')
            ->missing('infoRequest.requester_address')
            ->missing('infoRequest.tracking_code')
        );
    }

    public function test_invalid_info_request_ticket_returns_error(): void
    {
        $response = $this->post('/permohonan-info/cek', [
            'ticket' => 'IFM-XXXXX',
        ]);

        $response->assertSessionHasErrors('ticket');
    }

    public function test_info_request_success_page_loads(): void
    {
        $infoRequest = InfoRequest::factory()->create();

        $this->get("/permohonan-info/selesai/{$infoRequest->ticket}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/InfoRequest/Success')
                ->where('ticket', $infoRequest->ticket)
                ->missing('tracking_code')
            );
    }
}
