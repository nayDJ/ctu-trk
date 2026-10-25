<?php

namespace Tests\Feature\Admin;

use App\Models\Agenda;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgendaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_agenda_with_local_datetime(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agenda = $this->createAgenda();

        $this->actingAs($admin)->put("/admin/agendas/{$agenda->id}", [
            'title' => 'Judul Baru',
            'description' => 'Deskripsi baru',
            'starts_at' => '2026-10-25T09:15',
            'ends_at' => '2026-10-25T12:00',
            'location' => 'Aula Kecamatan',
            'is_published' => '1',
        ])->assertRedirect(route('admin.agendas.index'));

        $this->assertDatabaseHas('agendas', [
            'id' => $agenda->id,
            'title' => 'Judul Baru',
            'location' => 'Aula Kecamatan',
            'is_published' => true,
        ]);

        expect($agenda->fresh()->starts_at->format('Y-m-d H:i'))->toBe('2026-10-25 09:15');
    }

    public function test_update_rejects_end_time_before_start_time(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agenda = $this->createAgenda();

        $this->actingAs($admin)
            ->from('/admin/agendas')
            ->put("/admin/agendas/{$agenda->id}", [
                'title' => 'Judul Baru',
                'starts_at' => '2026-10-25T09:15',
                'ends_at' => '2026-10-24T12:00',
                'location' => 'Aula Kecamatan',
                'is_published' => '1',
            ])
            ->assertSessionHasErrors('ends_at')
            ->assertRedirect('/admin/agendas');
    }

    public function test_inertia_validation_error_is_not_rendered_as_server_error_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $agenda = $this->createAgenda();

        $response = $this->actingAs($admin)
            ->withHeader('X-Inertia', 'true')
            ->put("/admin/agendas/{$agenda->id}", [
                'title' => 'Judul Baru',
                'starts_at' => '2026-10-25T09:15',
                'ends_at' => '2026-10-24T12:00',
            ]);

        $response->assertStatus(303);
        $response->assertSessionHasErrors('ends_at');
    }

    private function createAgenda(): Agenda
    {
        return Agenda::create([
            'title' => 'Musyawarah Kecamatan',
            'description' => 'Pembahasan program kerja.',
            'starts_at' => now()->addDays(3)->setTime(9, 0),
            'ends_at' => now()->addDays(3)->setTime(12, 0),
            'location' => 'Aula Kecamatan Tarakan Utara',
            'is_published' => true,
        ]);
    }
}
