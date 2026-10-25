<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreOfficialRequest;
use App\Http\Requests\Admin\UpdateOfficialRequest;
use App\Models\Official;
use App\Models\Village;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Storage;

class OfficialController extends Controller
{
    use Auditable;

    public function index()
    {
        $officials = Official::with('village')->latest('sort_order')->paginate(15);
        $villages = Village::orderBy('name')->get();

        return inertia('Admin/Officials/Index', ['officials' => $officials, 'villages' => $villages]);
    }

    public function store(StoreOfficialRequest $request)
    {
        $validated = $request->validated();

        if (($validated['village_id'] ?? null) === '') {
            $validated['village_id'] = null;
        }

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('officials', 'public');
        } else {
            unset($validated['photo']);
        }

        $official = Official::create($validated);

        $this->logAudit('create', 'Official', $official->id);

        return redirect()->route('admin.officials.index')->with('success', 'Pejabat berhasil ditambahkan.');
    }

    public function update(UpdateOfficialRequest $request, Official $official)
    {
        $validated = $request->validated();

        if (($validated['village_id'] ?? null) === '') {
            $validated['village_id'] = null;
        }

        if ($request->hasFile('photo')) {
            if ($official->photo) {
                Storage::disk('public')->delete($official->photo);
            }
            $validated['photo'] = $request->file('photo')->store('officials', 'public');
        } else {
            unset($validated['photo']);
        }

        $official->update($validated);

        $this->logAudit('update', 'Official', $official->id);

        return redirect()->route('admin.officials.index')->with('success', 'Pejabat berhasil diperbarui.');
    }

    public function destroy(Official $official)
    {
        if ($official->photo) {
            Storage::disk('public')->delete($official->photo);
        }
        $official->delete();

        $this->logAudit('delete', 'Official', $official->id);

        return redirect()->route('admin.officials.index')->with('success', 'Pejabat berhasil dihapus.');
    }
}
