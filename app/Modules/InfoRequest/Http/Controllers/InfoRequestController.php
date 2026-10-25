<?php

namespace App\Modules\InfoRequest\Http\Controllers;

use App\Http\Requests\StoreInfoRequestRequest;
use App\Models\InfoRequest;
use App\Modules\InfoRequest\Support\TicketGenerator;
use Illuminate\Http\Request;

class InfoRequestController extends Controller
{
    public function store(StoreInfoRequestRequest $request)
    {
        $validated = $request->validated();

        // Honeypot check
        if (! empty($validated['website'])) {
            return back()->with('success', 'Permohonan informasi berhasil dikirim.');
        }

        $validated['ticket'] = TicketGenerator::generate();
        $validated['tracking_code'] = TicketGenerator::generateTrackingCode();
        $validated['status'] = 'SUBMITTED';

        unset($validated['website']);

        $infoRequest = InfoRequest::create($validated);

        $infoRequest->histories()->create([
            'status' => 'SUBMITTED',
            'note' => 'Permohonan informasi berhasil dikirim.',
            'admin_id' => null,
        ]);

        return redirect()->route('info-request.success', ['ticket' => $infoRequest->ticket])
            ->with('ticket', $infoRequest->ticket);
    }

    public function doCheck(Request $request)
    {
        $request->validate([
            'ticket' => 'required|string',
        ]);

        $infoRequest = InfoRequest::where('ticket', $request->ticket)
            ->with([
                'histories:id,info_request_id,status,note,content_link,created_at',
                'files:id,info_request_id,type,path,mime,size',
            ])
            ->first(['id', 'ticket', 'title', 'description', 'info_requested', 'status']);

        if (! $infoRequest) {
            return back()->withErrors(['ticket' => 'Nomor tiket tidak ditemukan.']);
        }

        return inertia('Public/InfoRequest/Result', [
            'infoRequest' => $infoRequest,
        ]);
    }

    public function success(string $ticket)
    {
        return inertia('Public/InfoRequest/Success', [
            'ticket' => session('ticket', $ticket),
        ]);
    }
}
