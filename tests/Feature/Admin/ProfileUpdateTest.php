<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_loads(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($user)->get('/admin/profil');

        $response->assertStatus(200);
    }

    public function test_profile_update_saves_settings_and_image_keys(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($user)->put('/admin/profil', [
            'kecamatan_name' => 'Kecamatan Tarakan Utara',
            'alamat' => 'Jalan Contoh No. 1',
            'struktur_organisasi_image' => UploadedFile::fake()->image('struktur.jpg'),
            'ppid_struktur_image' => UploadedFile::fake()->image('ppid.jpg'),
        ]);

        $response->assertSessionHas('success');
        $this->assertSame('Kecamatan Tarakan Utara', Setting::getValue('kecamatan_name'));
        $this->assertNotNull(Setting::getValue('struktur_organisasi_image'));
        $this->assertNotNull(Setting::getValue('ppid_struktur_image'));
    }

    public function test_profile_update_replaces_previous_image_key(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'super_admin']);
        Setting::set('struktur_organisasi_image', 'struktur/old.jpg');
        Storage::disk('public')->put('struktur/old.jpg', 'x');

        $response = $this->actingAs($user)->put('/admin/profil', [
            'struktur_organisasi_image' => UploadedFile::fake()->image('baru.jpg'),
        ]);

        $response->assertSessionHas('success');
        $this->assertStringStartsWith('struktur/', Setting::getValue('struktur_organisasi_image'));
        $this->assertNotSame('struktur/old.jpg', Setting::getValue('struktur_organisasi_image'));
        Storage::disk('public')->assertMissing('struktur/old.jpg');
    }

    public function test_profile_update_text_and_image_deletes_old_file(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'super_admin']);
        Setting::set('ppid_struktur_image', 'struktur/lama.jpg');
        Storage::disk('public')->put('struktur/lama.jpg', 'x');

        $response = $this->actingAs($user)->put('/admin/profil', [
            'kecamatan_name' => 'Kecamatan Baru',
            'ppid_struktur_image' => UploadedFile::fake()->image('baru.jpg'),
        ]);

        $response->assertSessionHas('success');
        $this->assertSame('Kecamatan Baru', Setting::getValue('kecamatan_name'));
        $this->assertStringStartsWith('struktur/', Setting::getValue('ppid_struktur_image'));
        Storage::disk('public')->assertMissing('struktur/lama.jpg');
    }

    public function test_profile_update_clears_cached_settings_and_public_page_reflects_it(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        Cache::put(Setting::CACHE_KEY, [
            'ppid_deskripsi' => 'Deskripsi lama',
            'ppid_profil' => 'Profil lama',
        ], 300);

        $this->actingAs($user)->put('/admin/profil', [
            'ppid_deskripsi' => 'Deskripsi baru',
            'ppid_profil' => 'Profil baru',
        ])->assertSessionHas('success');

        $this->assertSame('Deskripsi baru', Setting::getValue('ppid_deskripsi'));
        $this->assertSame('Profil baru', Setting::getValue('ppid_profil'));

        $this->get('/ppid')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('settings.ppid_deskripsi', 'Deskripsi baru')
                ->where('settings.ppid_profil', 'Profil baru')
            );
    }

    public function test_settings_update_clears_cached_settings_and_public_page_reflects_it(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        Cache::put(Setting::CACHE_KEY, [
            'ppid_deskripsi' => 'Deskripsi lama',
        ], 300);

        $this->actingAs($user)->put('/admin/settings', [
            'ppid_deskripsi' => 'Deskripsi baru',
        ])->assertSessionHas('success');

        $this->get('/ppid')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('settings.ppid_deskripsi', 'Deskripsi baru')
            );
    }
}
