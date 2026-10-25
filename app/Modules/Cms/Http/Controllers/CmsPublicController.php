<?php

namespace App\Modules\Cms\Http\Controllers;

use App\Models\Agenda;
use App\Models\Gallery;
use App\Models\Message;
use App\Models\Official;
use App\Models\Post;
use App\Models\PpidDocument;
use App\Models\Service;
use Illuminate\Http\Request;

class CmsPublicController extends Controller
{
    public function profile(?string $section = null)
    {
        // ponytail: settings + villages datang dari shared props HandleInertiaRequests
        return inertia('Public/Profile', [
            'section' => $section ?? 'tentang-kami',
            'officials' => Official::orderBy('sort_order')->get(['id', 'name', 'position', 'photo']),
        ]);
    }

    public function information()
    {
        $posts = Post::where('is_published', true)
            ->latest('published_at')
            ->limit(8)
            ->get(['id', 'title', 'slug', 'image', 'published_at']);

        $agendaFields = ['id', 'title', 'starts_at', 'location', 'image_path'];

        $upcomingAgendas = Agenda::published()
            ->upcomingOrOngoing()
            ->orderBy('starts_at')
            ->limit(8)
            ->get($agendaFields);

        $pastAgendas = Agenda::published()
            ->past()
            ->orderByDesc('starts_at')
            ->limit(8)
            ->get($agendaFields);

        $galleries = Gallery::where('is_published', true)
            ->latest()
            ->limit(8)
            ->get(['id', 'title', 'caption', 'credit', 'path']);

        return inertia('Public/Information', [
            'posts' => $posts,
            'upcomingAgendas' => $upcomingAgendas,
            'pastAgendas' => $pastAgendas,
            'galleries' => $galleries,
        ]);
    }

    public function beritaIndex()
    {
        $posts = Post::where('is_published', true)->latest('published_at')->paginate(12);

        return inertia('Public/Berita/Index', ['posts' => $posts]);
    }

    public function beritaShow(string $slug)
    {
        $post = Post::with('author:id,name')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
        $post->append('body_html');

        return inertia('Public/Berita/Show', ['post' => $post]);
    }

    public function agendaIndex()
    {
        $upcomingAgendas = Agenda::published()
            ->upcomingOrOngoing()
            ->orderBy('starts_at')
            ->paginate(8, ['*'], 'upcoming_page')
            ->withQueryString();

        $pastAgendas = Agenda::published()
            ->past()
            ->orderByDesc('starts_at')
            ->paginate(8, ['*'], 'past_page')
            ->withQueryString();

        return inertia('Public/Agenda/Index', [
            'upcomingAgendas' => $upcomingAgendas,
            'pastAgendas' => $pastAgendas,
        ]);
    }

    public function agendaShow(Agenda $agenda)
    {
        abort_unless($agenda->is_published, 404);

        return inertia('Public/Agenda/Show', [
            'agenda' => $agenda->only(['id', 'title', 'description', 'starts_at', 'ends_at', 'location', 'image_path']),
        ]);
    }

    public function galeriIndex()
    {
        $galleries = Gallery::where('is_published', true)->latest()->paginate(12);

        return inertia('Public/Galeri/Index', ['galleries' => $galleries]);
    }

    public function documents()
    {
        $documents = PpidDocument::where('is_published', true)->latest()->paginate(12);

        return inertia('Public/Dokumen/Index', ['documents' => $documents]);
    }

    public function layananIndex()
    {
        $services = Service::where('is_published', true)->latest()->paginate(12);

        return inertia('Public/Layanan/Index', ['services' => $services]);
    }

    public function layananShow(string $slug)
    {
        $service = Service::where('slug', $slug)->where('is_published', true)->firstOrFail();

        return inertia('Public/Layanan/Show', ['service' => $service]);
    }

    public function formulir()
    {
        return inertia('Public/Formulir');
    }

    public function ppidIndex(Request $request)
    {
        $category = $request->query('category', 'berkala');

        return inertia('Public/Ppid/Index', [
            'documents' => PpidDocument::where('is_published', true)
                ->where('category', $category)
                ->latest()
                ->paginate(12),
            'activeCategory' => $category,
            'documentCounts' => PpidDocument::where('is_published', true)
                ->selectRaw('category, count(*) as total')
                ->groupBy('category')
                ->pluck('total', 'category')
                ->toArray(),
        ]);
    }

    public function sp4nLapor()
    {
        return inertia('Public/Sp4n');
    }

    public function contact()
    {
        return inertia('Public/Contact', [
            'recentPosts' => Post::where('is_published', true)
                ->latest('published_at')
                ->limit(3)
                ->get(['id', 'title', 'slug', 'image', 'published_at']),
            'recentAgendas' => Agenda::where('is_published', true)
                ->latest('starts_at')
                ->limit(3)
                ->get(['id', 'title', 'description', 'starts_at']),
        ]);
    }

    public function submitMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Message::create($validated);

        return back()->with('success', 'Pesan berhasil dikirim. Kami akan merespon segera.');
    }

    public function privacy()
    {
        return inertia('Public/Privacy');
    }
}
