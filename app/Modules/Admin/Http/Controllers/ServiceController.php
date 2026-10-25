<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    use Auditable;

    public function index()
    {
        $services = Service::latest()->paginate(15);

        return inertia('Admin/Services/Index', ['services' => $services]);
    }

    public function store(StoreServiceRequest $request)
    {
        $validated = $request->validated();

        $validated['slug'] = $this->uniqueSlug(Str::slug($validated['name']));
        $validated['created_by'] = auth()->id();

        $service = Service::create($validated);

        $this->logAudit('create', 'Service', $service->id);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug(Str::slug($validated['name']), $service->id);
        }

        $service->update($validated);

        $this->logAudit('update', 'Service', $service->id);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    public function publish(Service $service)
    {
        $service->update(['is_published' => ! $service->is_published]);

        $this->logAudit('status_change', 'Service', $service->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        $this->logAudit('delete', 'Service', $service->id);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil dihapus.');
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        for ($i = 2; Service::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists(); $slug = "{$base}-{$i}", $i++) {
            // ponytail: loop secukupnya sampai slug bebas
        }

        return $slug;
    }
}
