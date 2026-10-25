<?php

namespace App\Modules\Content\Http\Controllers;

use App\Models\Complaint;
use App\Models\Post;
use App\Models\Service;
use App\Models\Slider;

class PageController extends Controller
{
    public function home()
    {
        $sliders = Slider::where('is_published', true)->orderBy('sort_order')->get();
        $services = Service::where('is_published', true)
            ->whereIn('slug', ['pengaduan-masyarakat', 'permohonan-informasi-publik'])
            ->limit(2)
            ->get(['id', 'name', 'slug', 'description']);
        $latestBerita = Post::where('is_published', true)
            ->latest('published_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'excerpt', 'published_at', 'image']);

        $completedComplaints = Complaint::where('status', 'COMPLETED')
            ->latest()
            ->limit(9)
            ->get(['id', 'title', 'description', 'is_anonymous']);

        // ponytail: settings datang dari shared prop HandleInertiaRequests (cached)
        return inertia('Public/Home', [
            'sliders' => $sliders,
            'services' => $services,
            'latestBerita' => $latestBerita,
            'completedComplaints' => $completedComplaints,
        ]);
    }
}
