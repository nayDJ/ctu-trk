<?php

namespace App\Modules\Complaint\Http\Controllers;

use App\Http\Requests\StoreComplaintRequest;
use App\Models\Category;
use App\Models\Complaint;
use App\Models\ComplaintFile;
use App\Modules\Complaint\Support\TicketGenerator;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function create()
    {
        return inertia('Public/Complaint/Create', [
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(StoreComplaintRequest $request)
    {
        $validated = $request->validated();

        // Honeypot check
        if (! empty($validated['website'])) {
            return back()->with('success', 'Pengaduan berhasil dikirim.');
        }

        $validated['ticket'] = TicketGenerator::generate();
        $validated['tracking_code'] = TicketGenerator::generateTrackingCode();
        $validated['status'] = 'SUBMITTED';

        if (! empty($validated['is_anonymous']) && $validated['is_anonymous']) {
            $validated['reporter_name'] = 'Anonim';
            $validated['reporter_phone'] = '-';
            $validated['reporter_email'] = null;
            $validated['reporter_address'] = null;
        }

        $file = $validated['evidence'] ?? null;
        unset($validated['evidence'], $validated['website']);

        $complaint = Complaint::create($validated);

        if ($file) {
            $path = $file->store('complaints/evidence', 'public');
            ComplaintFile::create([
                'complaint_id' => $complaint->id,
                'type' => 'evidence',
                'path' => $path,
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
        }

        $complaint->histories()->create([
            'status' => 'SUBMITTED',
            'note' => 'Pengaduan berhasil dikirim.',
            'admin_id' => null,
        ]);

        return redirect()->route('complaint.success', ['ticket' => $complaint->ticket])
            ->with('ticket', $complaint->ticket);
    }

    public function check()
    {
        return inertia('Public/Complaint/Check');
    }

    public function doCheck(Request $request)
    {
        $request->validate([
            'ticket' => 'required|string',
        ]);

        $complaint = Complaint::where('ticket', $request->ticket)
            ->with([
                'category:id,name',
                'histories:id,complaint_id,status,note,content_link,created_at',
                'files:id,complaint_id,type,path,mime,size',
            ])
            ->first(['id', 'ticket', 'category_id', 'title', 'description', 'location', 'status']);

        if (! $complaint) {
            return back()->withErrors(['ticket' => 'Nomor tiket tidak ditemukan.']);
        }

        return inertia('Public/Complaint/Result', [
            'complaint' => $complaint,
        ]);
    }

    public function success(string $ticket)
    {
        return inertia('Public/Complaint/Success', [
            'ticket' => session('ticket', $ticket),
        ]);
    }
}
