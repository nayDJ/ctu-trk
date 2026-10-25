<?php

namespace Tests\Feature\Public;

use App\Models\Category;
use App\Models\Complaint;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_loads(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_completed_complaint_identities_and_tickets_are_not_exposed_on_home_page(): void
    {
        $complaint = Complaint::factory()->completed()->create(['title' => 'Jalan Sudah Diperbaiki']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('completedComplaints.0.title', $complaint->title)
            ->missing('completedComplaints.0.reporter_name')
            ->missing('completedComplaints.0.ticket')
        );
    }

    public function test_profile_page_loads(): void
    {
        $response = $this->get('/profil');

        $response->assertStatus(200);
    }

    public function test_profile_section_prop_is_passed(): void
    {
        $this->get('/profil/visi-misi')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Profile')
                ->where('section', 'visi-misi')
            );
    }

    public function test_home_receives_published_villages(): void
    {
        Village::create([
            'name' => 'Juata Laut',
            'leader_name' => 'Budi',
            'photo' => 'villages/juata-laut.jpg',
            'is_published' => true,
        ]);
        Village::create([
            'name' => 'Juata Kerikil',
            'leader_name' => 'Siti',
            'photo' => 'villages/juata-kerikil.jpg',
            'is_published' => true,
        ]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('villages', 2)
        );
    }

    public function test_berita_page_loads(): void
    {
        $response = $this->get('/informasi/berita');

        $response->assertStatus(200);
    }

    public function test_agenda_page_loads(): void
    {
        $response = $this->get('/informasi/agenda');

        $response->assertStatus(200);
    }

    public function test_galeri_page_loads(): void
    {
        $response = $this->get('/informasi/galeri');

        $response->assertStatus(200);
    }

    public function test_layanan_page_loads(): void
    {
        $response = $this->get('/layanan');

        $response->assertStatus(200);
    }

    public function test_ppid_page_loads(): void
    {
        $response = $this->get('/ppid');

        $response->assertStatus(200);
    }

    public function test_kontak_page_loads(): void
    {
        $response = $this->get('/kontak');

        $response->assertStatus(200);
    }

    public function test_sp4n_page_loads(): void
    {
        $response = $this->get('/sp4n');

        $response->assertStatus(200);
    }

    public function test_privasi_page_loads(): void
    {
        $response = $this->get('/privasi');

        $response->assertStatus(200);
    }

    public function test_formulir_page_loads(): void
    {
        $response = $this->get('/formulir');

        $response->assertStatus(200);
    }

    public function test_complaint_create_page_loads(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->get('/pengaduan/buat');

        $response->assertStatus(200);
    }

    public function test_info_request_create_redirects_to_pengaduan_buat(): void
    {
        $response = $this->get('/permohonan-info/buat');

        $response->assertRedirect('/pengaduan/buat');
    }

    public function test_info_request_check_page_redirects_to_pengaduan_cek(): void
    {
        $response = $this->get('/permohonan-info/cek');

        $response->assertRedirect('/pengaduan/cek');
    }
}
