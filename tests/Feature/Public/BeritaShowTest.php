<?php

namespace Tests\Feature\Public;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BeritaShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_plain_text_body_is_formatted_into_paragraphs(): void
    {
        $post = Post::factory()->create([
            'body' => "Paragraf satu.\n\nParagraf dua.\nBaris kedua.",
        ]);

        $this->assertSame(
            '<p>Paragraf satu.</p><p>Paragraf dua.<br>Baris kedua.</p>',
            $post->body_html,
        );
    }

    public function test_html_body_is_preserved(): void
    {
        $body = '<p>Paragraf <strong>satu</strong>.</p><p>Paragraf dua.</p>';
        $post = Post::factory()->create(['body' => $body]);

        $this->assertSame($body, $post->body_html);
    }

    public function test_plain_text_is_escaped(): void
    {
        $post = Post::factory()->create([
            'body' => 'Harga < 100 & stok > 0.',
        ]);

        $this->assertSame(
            '<p>Harga &lt; 100 &amp; stok &gt; 0.</p>',
            $post->body_html,
        );
    }

    public function test_public_article_receives_formatted_body(): void
    {
        $post = Post::factory()->create([
            'body' => "Paragraf satu.\n\nParagraf dua.",
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this->get("/informasi/berita/{$post->slug}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Berita/Show')
                ->where('post.body_html', '<p>Paragraf satu.</p><p>Paragraf dua.</p>')
            );
    }

    public function test_public_article_receives_author_name_only(): void
    {
        $author = User::factory()->create([
            'name' => 'Penulis Berita',
            'email' => 'penulis@example.com',
            'role' => 'super_admin',
        ]);
        $post = Post::factory()->create([
            'author_id' => $author->id,
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this->get("/informasi/berita/{$post->slug}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Berita/Show')
                ->where('post.author.name', 'Penulis Berita')
                ->missing('post.author.email')
                ->missing('post.author.role')
            );
    }
}
