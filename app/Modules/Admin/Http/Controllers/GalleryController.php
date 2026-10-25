<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    use Auditable;

    public function index(Request $request)
    {
        // ponytail: kolom list+drawer saja (caption/credit kecil, dipakai drawer edit)
        $query = Gallery::with('creator')->select(['id', 'title', 'caption', 'credit', 'path', 'is_published', 'created_by', 'created_at'])->latest();

        if (auth()->user()->role === 'user') {
            $query->where('created_by', auth()->id());
        }

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $galleries = $query->paginate(15)->withQueryString();

        return inertia('Admin/Galleries/Index', ['galleries' => $galleries, 'filters' => ['search' => $request->input('search', '')]]);
    }

    public function store(StoreGalleryRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        $validated['path'] = $request->file('path')->store('galleries', 'public');

        $gallery = Gallery::create($validated);

        $this->logAudit('create', 'Gallery', $gallery->id);

        return redirect()->route('admin.galleries.index')->with('success', 'Galeri berhasil ditambahkan.');
    }

    public function update(UpdateGalleryRequest $request, Gallery $gallery)
    {
        $this->authorizeOwnership($gallery);

        $validated = $request->validated();

        if ($request->hasFile('path')) {
            Storage::disk('public')->delete($gallery->path);
            $validated['path'] = $request->file('path')->store('galleries', 'public');
        } else {
            unset($validated['path']);
        }

        $gallery->update($validated);

        $this->logAudit('update', 'Gallery', $gallery->id);

        return redirect()->route('admin.galleries.index')->with('success', 'Galeri berhasil diperbarui.');
    }

    public function publish(Gallery $gallery)
    {
        $this->authorizeOwnership($gallery);

        $gallery->update(['is_published' => ! $gallery->is_published]);

        $this->logAudit('status_change', 'Gallery', $gallery->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(Gallery $gallery)
    {
        if (auth()->user()->role !== 'super_admin') {
            abort(403, 'Hanya super admin yang dapat menghapus.');
        }

        Storage::disk('public')->delete($gallery->path);
        $gallery->delete();

        $this->logAudit('delete', 'Gallery', $gallery->id);

        return redirect()->route('admin.galleries.index')->with('success', 'Galeri berhasil dihapus.');
    }

    private function authorizeOwnership(Gallery $gallery): void
    {
        $user = auth()->user();
        if ($user->role === 'user' && $gallery->created_by !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah konten ini.');
        }
    }
}
