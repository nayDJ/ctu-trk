<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreAgendaRequest;
use App\Http\Requests\Admin\UpdateAgendaRequest;
use App\Models\Agenda;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AgendaController extends Controller
{
    use Auditable;

    public function index(Request $request)
    {
        // ponytail: kolom list+drawer saja; description dipertahankan (drawer edit pakai baris langsung, tanpa showJson)
        $query = Agenda::with('creator')->select(['id', 'title', 'description', 'starts_at', 'ends_at', 'location', 'image_path', 'is_published', 'created_by', 'created_at'])->latest('starts_at');

        if (auth()->user()->role === 'user') {
            $query->where('created_by', auth()->id());
        }

        if ($search = $request->input('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('location', 'like', "%{$search}%"));
        }

        $agendas = $query->paginate(15)->withQueryString();

        return inertia('Admin/Agendas/Index', ['agendas' => $agendas, 'filters' => ['search' => $request->input('search', '')]]);
    }

    public function store(StoreAgendaRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('agendas', 'public');
        }
        unset($validated['image']);

        $agenda = Agenda::create($validated);

        $this->logAudit('create', 'Agenda', $agenda->id);

        return redirect()->route('admin.agendas.index')->with('success', 'Agenda berhasil ditambahkan.');
    }

    public function update(UpdateAgendaRequest $request, Agenda $agenda)
    {
        $this->authorizeOwnership($agenda);

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($agenda->image_path) {
                Storage::disk('public')->delete($agenda->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('agendas', 'public');
        }
        unset($validated['image']);

        $agenda->update($validated);

        $this->logAudit('update', 'Agenda', $agenda->id);

        return redirect()->route('admin.agendas.index')->with('success', 'Agenda berhasil diperbarui.');
    }

    public function publish(Agenda $agenda)
    {
        $this->authorizeOwnership($agenda);

        $agenda->update(['is_published' => ! $agenda->is_published]);

        $this->logAudit('status_change', 'Agenda', $agenda->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(Agenda $agenda)
    {
        if (auth()->user()->role !== 'super_admin') {
            abort(403, 'Hanya super admin yang dapat menghapus.');
        }

        if ($agenda->image_path) {
            Storage::disk('public')->delete($agenda->image_path);
        }
        $agenda->delete();

        $this->logAudit('delete', 'Agenda', $agenda->id);

        return redirect()->route('admin.agendas.index')->with('success', 'Agenda berhasil dihapus.');
    }

    private function authorizeOwnership(Agenda $agenda): void
    {
        $user = auth()->user();
        if ($user->role === 'user' && $agenda->created_by !== $user->id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah konten ini.');
        }
    }
}
