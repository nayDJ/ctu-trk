<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\UpdateInfoRequestRequest;
use App\Models\InfoRequest;
use App\Models\InfoRequestFile;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InfoRequestController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: tabel hanya render id/tiket/judul/status — tanpa kolom teks besar
        $infoRequests = InfoRequest::select(['id', 'ticket', 'title', 'status'])->latest()->paginate(15);

        return inertia('Admin/InfoRequests/Index', ['infoRequests' => $infoRequests]);
    }

    public function show(InfoRequest $info_request)
    {
        $info_request->load(['histories.admin', 'files']);

        $canViewPii = $this->canViewPii();

        if (! $canViewPii) {
            $this->maskPii($info_request);
        }

        return inertia('Admin/InfoRequests/Show', [
            'infoRequest' => $info_request,
            'canViewPii' => $canViewPii,
            'canManage' => in_array(auth()->user()?->role, ['admin', 'super_admin'], true),
        ]);
    }

    public function showJson(InfoRequest $info_request)
    {
        $info_request->load(['histories.admin', 'files']);

        $canViewPii = $this->canViewPii();

        if (! $canViewPii) {
            $this->maskPii($info_request);
        }

        return response()->json([
            'infoRequest' => $info_request,
            'canViewPii' => $canViewPii,
        ]);
    }

    public function update(UpdateInfoRequestRequest $request, InfoRequest $info_request)
    {
        $validated = $request->validated();

        $oldStatus = $info_request->status;

        $info_request->fill(['status' => $validated['status']]);
        $statusChanged = $info_request->isDirty('status');
        $hasNote = filled($validated['note'] ?? null);
        $hasContentLink = filled($validated['content_link'] ?? null);
        $shouldWriteHistory = $statusChanged || $hasNote || $hasContentLink;

        $storedPaths = [];

        try {
            DB::transaction(function () use ($info_request, $validated, $shouldWriteHistory, &$storedPaths) {
                $info_request->save();

                if ($shouldWriteHistory) {
                    $info_request->histories()->create([
                        'status' => $validated['status'],
                        'note' => $validated['note'] ?? null,
                        'content_link' => $validated['content_link'] ?? null,
                        'admin_id' => auth()->id(),
                    ]);
                }

                // Handle follow-up files
                if (! empty($validated['follow_up_files'])) {
                    foreach ($validated['follow_up_files'] as $file) {
                        $path = $file->store('info-requests/follow-ups', 'public');
                        $storedPaths[] = $path;
                        InfoRequestFile::create([
                            'info_request_id' => $info_request->id,
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
            $this->logAudit('status_change', 'InfoRequest', $info_request->id, $oldStatus->value.' → '.$validated['status']);
        }

        $this->forgetStatsCache();

        return redirect()->route('admin.info-requests.index')
            ->with('success', 'Status permohonan informasi berhasil diperbarui.');
    }

    public function destroy(InfoRequest $info_request)
    {
        $info_request->load('files');
        foreach ($info_request->files as $file) {
            Storage::disk('public')->delete($file->path);
        }
        $info_request->delete();

        $this->forgetStatsCache();

        $this->logAudit('delete', 'InfoRequest', $info_request->id);

        return redirect()->route('admin.info-requests.index')->with('success', 'Permohonan informasi berhasil dihapus.');
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

    private function maskPii(InfoRequest $info_request): void
    {
        $info_request->requester_name = mask_name($info_request->requester_name);
        $info_request->requester_phone = mask_phone($info_request->requester_phone);
        if ($info_request->requester_email) {
            $info_request->requester_email = mask_email($info_request->requester_email);
        }
        if ($info_request->requester_address) {
            $info_request->requester_address = mask_address($info_request->requester_address);
        }
    }
}
