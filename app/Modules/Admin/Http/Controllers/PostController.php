<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Post;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    use Auditable;

    public function index(Request $request)
    {
        // ponytail: kolom list+drawer saja; body/excerpt dipertahankan (drawer edit pakai baris langsung, tanpa showJson)
        $query = Post::with('author')->select(['id', 'title', 'slug', 'excerpt', 'body', 'image', 'is_published', 'published_at', 'author_id', 'created_at'])->latest();

        if (auth()->user()->role === 'user') {
            $query->where('author_id', auth()->id());
        }

        if ($search = $request->input('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('excerpt', 'like', "%{$search}%"));
        }

        $posts = $query->paginate(15)->withQueryString();

        return inertia('Admin/Posts/Index', ['posts' => $posts, 'filters' => ['search' => $request->input('search', '')]]);
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();

        $validated['slug'] = $this->uniqueSlug(Str::slug($validated['title']));
        $validated['author_id'] = auth()->id();

        // ponytail: published_at mengikuti checkbox publish
        $validated['published_at'] = ! empty($validated['is_published']) ? now() : null;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('posts', 'public');
        } else {
            unset($validated['image']);
        }

        $post = Post::create($validated);

        $this->logAudit('create', 'Post', $post->id);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil ditambahkan.');
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorizeOwnership($post);

        $validated = $request->validated();

        if (isset($validated['title'])) {
            $validated['slug'] = $this->uniqueSlug(Str::slug($validated['title']), $post->id);
        }

        // ponytail: pertahankan tanggal publish lama bila tetap published
        if (! empty($validated['is_published'])) {
            $validated['published_at'] = $post->published_at ?? now();
        } else {
            $validated['published_at'] = null;
        }

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $validated['image'] = $request->file('image')->store('posts', 'public');
        } else {
            unset($validated['image']);
        }

        $post->update($validated);

        $this->logAudit('update', 'Post', $post->id);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Post $post)
    {
        if (auth()->user()->role !== 'super_admin') {
            abort(403, 'Hanya super admin yang dapat menghapus.');
        }

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        $this->logAudit('delete', 'Post', $post->id);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil dihapus.');
    }

    public function publish(Post $post)
    {
        $this->authorizeOwnership($post);

        $post->update([
            'is_published' => ! $post->is_published,
            'published_at' => $post->is_published ? null : now(),
        ]);

        $this->logAudit('status_change', 'Post', $post->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    private function authorizeOwnership(Post $post): void
    {
        $user = auth()->user();
        if ($user->role === 'user' && $post->author_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah konten ini.');
        }
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        for ($i = 2; Post::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists(); $slug = "{$base}-{$i}", $i++) {
            // ponytail: loop secukupnya sampai slug bebas
        }

        return $slug;
    }
}
