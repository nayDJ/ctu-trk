<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\UpdateComplaintRequest;
use App\Models\Complaint;
use App\Models\ComplaintFile;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: tabel hanya render id/tiket/judul/status/kategori — tanpa kolom teks besar
        $complaints = Complaint::with('category:id,name')->select(['id', 'ticket', 'title', 'status', 'category_id'])->latest()->paginate(15);

        return inertia('Admin/Complaints/Index', ['complaints' => $complaints]);
    }

    public function show(Complaint $complaint)
    {
        $complaint->load(['category', 'histories.admin', 'files']);

        $canViewPii = $this->canViewPii();

        if (! $canViewPii) {
            $this->maskPii($complaint);
        }

        return inertia('Admin/Complaints/Show', [
            'complaint' => $complaint,
            'canViewPii' => $canViewPii,
            'canManage' => in_array(auth()->user()?->role, ['admin', 'super_admin'], true),
        ]);
    }

    public function showJson(Complaint $complaint)
    {
        $complaint->load(['category', 'histories.admin', 'files']);

        $canViewPii = $this->canViewPii();

        if (! $canViewPii) {
            $this->maskPii($complaint);
        }

        return response()->json([
            'complaint' => $complaint,
            'canViewPii' => $canViewPii,
        ]);
    }

    public function update(UpdateComplaintRequest $request, Complaint $complaint)
    {
        $validated = $request->validated();

        $oldStatus = $complaint->status;

        $complaint->fill(['status' => $validated['status']]);
        $statusChanged = $complaint->isDirty('status');
        $hasNote = filled($validated['note'] ?? null);
        $hasContentLink = filled($validated['content_link'] ?? null);
        $shouldWriteHistory = $statusChanged || $hasNote || $hasContentLink;

        $storedPaths = [];

        try {
            DB::transaction(function () use ($complaint, $validated, $shouldWriteHistory, &$storedPaths) {
                $complaint->save();

                if ($shouldWriteHistory) {
                    $complaint->histories()->create([
                        'status' => $validated['status'],
                        'note' => $validated['note'] ?? null,
                        'content_link' => $validated['content_link'] ?? null,
                        'admin_id' => auth()->id(),
                    ]);
                }

                // Handle follow-up files
                if (! empty($validated['follow_up_files'])) {
                    foreach ($validated['follow_up_files'] as $file) {
                        $path = $file->store('complaints/follow-ups', 'public');
                        $storedPaths[] = $path;
                        ComplaintFile::create([
                            'complaint_id' => $complaint->id,
                            'type' => 'follow_up',
                            'path' => $path,
                            'mime' => $file->getMimeType(),
                            'size' => $file->getSize(),
                        ]);
                    }
                }
            });
        } catch (\Throwable $e) {
            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $e;
        }

        if ($statusChanged) {
            $this->logAudit('status_change', 'Complaint', $complaint->id, $oldStatus->value.' → '.$validated['status']);
        }

        $this->forgetStatsCache();

        return redirect()->route('admin.complaints.index')
            ->with('success', 'Status pengaduan berhasil diperbarui.');
    }

    public function destroy(Complaint $complaint)
    {
        $complaint->load('files');
        foreach ($complaint->files as $file) {
            Storage::disk('public')->delete($file->path);
        }
        $complaint->delete();

        $this->forgetStatsCache();

        $this->logAudit('delete', 'Complaint', $complaint->id);

        return redirect()->route('admin.complaints.index')->with('success', 'Pengaduan berhasil dihapus.');
    }

    private function forgetStatsCache(): void
    {
        Cache::forget('admin.dashboard.statistics');
        foreach (['harian', 'mingguan', 'bulanan', 'tahunan'] as $period) {
            Cache::forget("admin.statistics.{$period}");
        }
    }

    private function canViewPii(): bool
    {
        return in_array(auth()->user()?->role, ['admin', 'super_admin'], true);
    }

    private function maskPii(Complaint $complaint): void
    {
        // ponytail: anonim ("Anonim"/"-") tidak perlu disamarkan; sisa PII lama jangan ikut terkirim
        if ($complaint->is_anonymous) {
            $complaint->reporter_email = null;
            $complaint->reporter_address = null;

            return;
        }
        $complaint->reporter_name = mask_name($complaint->reporter_name);
        $complaint->reporter_phone = mask_phone($complaint->reporter_phone);
        if ($complaint->reporter_email) {
            $complaint->reporter_email = mask_email($complaint->reporter_email);
        }
        if ($complaint->reporter_address) {
            $complaint->reporter_address = mask_address($complaint->reporter_address);
        }
    }
}
