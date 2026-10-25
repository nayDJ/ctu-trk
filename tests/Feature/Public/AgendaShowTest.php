<?php

namespace Tests\Feature\Public;

use App\Models\Agenda;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AgendaShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_agenda_index_includes_uploaded_image(): void
    {
        $agenda = $this->createAgenda();

        $this->get('/informasi/agenda')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Agenda/Index')
                ->has('upcomingAgendas.data', 1)
                ->where('upcomingAgendas.data.0.id', $agenda->id)
                ->where('upcomingAgendas.data.0.image_path', 'agendas/musyawarah.png')
                ->has('pastAgendas.data', 0)
            );
    }

    public function test_public_agenda_index_separates_past_agendas(): void
    {
        $upcoming = $this->createAgenda();
        $past = $this->createAgenda([
            'title' => 'Musyawarah Bulan Lalu',
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->subDays(2)->addHours(2),
        ]);

        $this->get('/informasi/agenda')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Agenda/Index')
                ->has('upcomingAgendas.data', 1)
                ->where('upcomingAgendas.data.0.id', $upcoming->id)
                ->has('pastAgendas.data', 1)
                ->where('pastAgendas.data.0.id', $past->id)
            );
    }

    public function test_public_agenda_index_excludes_draft_agendas(): void
    {
        $this->createAgenda(['is_published' => false]);

        $this->get('/informasi/agenda')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Agenda/Index')
                ->has('upcomingAgendas.data', 0)
                ->has('pastAgendas.data', 0)
            );
    }

    public function test_public_information_page_separates_upcoming_and_past_agendas(): void
    {
        $upcoming = $this->createAgenda();
        $past = $this->createAgenda([
            'title' => 'Musyawarah Bulan Lalu',
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->subDays(2)->addHours(2),
        ]);

        $this->get('/informasi')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Information')
                ->has('upcomingAgendas', 1)
                ->where('upcomingAgendas.0.id', $upcoming->id)
                ->has('pastAgendas', 1)
                ->where('pastAgendas.0.id', $past->id)
            );
    }

    public function test_public_agenda_detail_displays_published_agenda(): void
    {
        $agenda = $this->createAgenda();

        $this->get("/informasi/agenda/{$agenda->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Agenda/Show')
                ->where('agenda.title', 'Musyawarah Kecamatan')
                ->where('agenda.location', 'Aula Kecamatan Tarakan Utara')
                ->where('agenda.image_path', 'agendas/musyawarah.png')
            );
    }

    public function test_public_agenda_detail_returns_not_found_for_unpublished_agenda(): void
    {
        $agenda = $this->createAgenda(['is_published' => false]);

        $this->get("/informasi/agenda/{$agenda->id}")->assertNotFound();
    }

    public function test_published_past_agenda_detail_remains_accessible(): void
    {
        $agenda = $this->createAgenda([
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->subDays(2)->addHours(2),
        ]);

        $this->get("/informasi/agenda/{$agenda->id}")->assertOk();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createAgenda(array $attributes = []): Agenda
    {
        return Agenda::create(array_merge([
            'title' => 'Musyawarah Kecamatan',
            'description' => "Pembahasan program kerja.\n\nPeserta: seluruh lurah.",
            'starts_at' => now()->addDays(3)->setTime(9, 0),
            'ends_at' => now()->addDays(3)->setTime(12, 0),
            'location' => 'Aula Kecamatan Tarakan Utara',
            'image_path' => 'agendas/musyawarah.png',
            'is_published' => true,
        ], $attributes));
    }
}
