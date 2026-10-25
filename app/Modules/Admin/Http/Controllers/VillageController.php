<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreVillageRequest;
use App\Http\Requests\Admin\UpdateVillageRequest;
use App\Models\Official;
use App\Models\Village;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Storage;

class VillageController extends Controller
{
    use Auditable;

    /**
     * Posisi yang dianggap sebagai lurah/ kepala desa.
     *
     * @var array<int, string>
     */
    private const LEADER_POSITIONS = ['Kepala Lurah', 'Lurah', 'Kepala Desa'];

    public function index()
    {
        $villages = Village::latest('sort_order')->paginate(15);

        return inertia('Admin/Villages/Index', ['villages' => $villages]);
    }

    public function store(StoreVillageRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['photo'] = $request->file('image')->store('villages', 'public');
        }
        unset($validated['image']);

        $village = Village::create($validated);

        $this->syncKepalaLurah($village);

        $this->logAudit('create', 'Village', $village->id);

        return redirect()->route('admin.villages.index')->with('success', 'Kelurahan berhasil ditambahkan.');
    }

    public function update(UpdateVillageRequest $request, Village $village)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($village->photo) {
                Storage::disk('public')->delete($village->photo);
            }
            $validated['photo'] = $request->file('image')->store('villages', 'public');
        }
        unset($validated['image']);

        $village->update($validated);

        $this->syncKepalaLurah($village);

        $this->logAudit('update', 'Village', $village->id);

        return redirect()->route('admin.villages.index')->with('success', 'Kelurahan berhasil diperbarui.');
    }

    public function publish(Village $village)
    {
        $village->update(['is_published' => ! $village->is_published]);

        $this->logAudit('status_change', 'Village', $village->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(Village $village)
    {
        if ($village->photo) {
            Storage::disk('public')->delete($village->photo);
        }

        $village->officials()
            ->whereIn('position', self::LEADER_POSITIONS)
            ->delete();

        $village->delete();

        $this->logAudit('delete', 'Village', $village->id);

        return redirect()->route('admin.villages.index')->with('success', 'Kelurahan berhasil dihapus.');
    }

    private function syncKepalaLurah(Village $village): void
    {
        $leaderName = trim((string) $village->leader_name);

        if ($leaderName === '') {
            $village->officials()
                ->whereIn('position', self::LEADER_POSITIONS)
                ->delete();

            return;
        }

        $linkedLeaders = $village->officials()
            ->whereIn('position', self::LEADER_POSITIONS)
            ->orderByRaw('photo IS NULL')
            ->orderBy('id')
            ->get();

        $leader = $linkedLeaders->shift();

        if (! $leader) {
            $leader = Official::query()
                ->whereIn('position', self::LEADER_POSITIONS)
                ->whereNull('village_id')
                ->where('name', $leaderName)
                ->orderByRaw('photo IS NULL')
                ->orderBy('id')
                ->first();
        }

        if ($leader) {
            $leader->update([
                'village_id' => $village->id,
                'name' => $leaderName,
                'position' => 'Kepala Lurah',
            ]);
        } else {
            $village->officials()->create([
                'name' => $leaderName,
                'position' => 'Kepala Lurah',
                'sort_order' => 0,
            ]);
        }

        $linkedLeaders->each->delete();
    }
}
