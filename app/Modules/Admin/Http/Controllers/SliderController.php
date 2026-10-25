<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreSliderRequest;
use App\Http\Requests\Admin\UpdateSliderRequest;
use App\Models\Slider;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: kolom list+drawer saja
        $query = Slider::with('creator:id,name')
            ->select(['id', 'title', 'image', 'link_url', 'sort_order', 'is_published', 'created_by', 'created_at'])
            ->orderBy('sort_order');

        if (auth()->user()->role === 'user') {
            $query->where('created_by', auth()->id());
        }

        $sliders = $query->paginate(15);

        return inertia('Admin/Sliders/Index', ['sliders' => $sliders]);
    }

    public function store(StoreSliderRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        $validated['image'] = $request->file('image')->store('sliders', 'public');

        $slider = Slider::create($validated);

        $this->logAudit('create', 'Slider', $slider->id);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider berhasil ditambahkan.');
    }

    public function update(UpdateSliderRequest $request, Slider $slider)
    {
        $this->authorizeOwnership($slider);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($slider->image);
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        } else {
            unset($validated['image']);
        }

        $slider->update($validated);

        $this->logAudit('update', 'Slider', $slider->id);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider berhasil diperbarui.');
    }

    public function publish(Slider $slider)
    {
        $this->authorizeOwnership($slider);

        $slider->update(['is_published' => ! $slider->is_published]);

        $this->logAudit('status_change', 'Slider', $slider->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(Slider $slider)
    {
        if (auth()->user()->role !== 'super_admin') {
            abort(403, 'Hanya super admin yang dapat menghapus.');
        }

        Storage::disk('public')->delete($slider->image);
        $slider->delete();

        $this->logAudit('delete', 'Slider', $slider->id);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider berhasil dihapus.');
    }

    private function authorizeOwnership(Slider $slider): void
    {
        $user = auth()->user();
        if ($user->role === 'user' && $slider->created_by !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah konten ini.');
        }
    }
}
