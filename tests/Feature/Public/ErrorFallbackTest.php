<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ErrorFallbackTest extends TestCase
{
    use RefreshDatabase;

    private function inertiaGet(string $uri)
    {
        return $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => hash_file('xxh128', public_path('build/manifest.json')),
        ])->get($uri);
    }

    public function test_inertia_404_renders_error_page(): void
    {
        $response = $this->inertiaGet('/halaman-tidak-ada-xyz');

        $response->assertStatus(404);
        $response->assertJsonPath('component', 'errors/404');
    }

    public function test_direct_html_404_renders_error_page(): void
    {
        $response = $this->get('/halaman-tidak-ada-xyz', ['Accept' => 'text/html']);

        $response->assertStatus(404);
        $response->assertViewIs('app');
        $response->assertInertia(fn ($page) => $page->component('errors/404'));
    }

    public function test_unknown_status_falls_back_to_500_page(): void
    {
        Route::middleware('web')->get('/_uji-503', fn () => abort(503));

        $response = $this->inertiaGet('/_uji-503');

        $response->assertStatus(503);
        $response->assertJsonPath('component', 'errors/500');
    }
}
