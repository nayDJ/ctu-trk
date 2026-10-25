<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\Message;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Cache;

class MessageController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: kolom list saja (id wajib); body/email dibaca via show/showJson
        $messages = Message::latest()->select(['id', 'name', 'subject', 'is_read', 'created_at'])->paginate(15);

        return inertia('Admin/Messages/Index', ['messages' => $messages]);
    }

    public function show(Message $message)
    {
        if (! $message->is_read) {
            $message->update(['is_read' => true, 'read_at' => now()]);
        }

        return inertia('Admin/Messages/Show', [
            'message' => $message,
            'canManage' => in_array(auth()->user()?->role, ['admin', 'super_admin'], true),
        ]);
    }

    public function showJson(Message $message)
    {
        if (! $message->is_read) {
            $message->update(['is_read' => true, 'read_at' => now()]);
        }

        return response()->json(['message' => $message]);
    }

    public function markRead(Message $message)
    {
        $message->update(['is_read' => ! $message->is_read, 'read_at' => $message->is_read ? null : now()]);

        $this->logAudit('update', 'Message', $message->id);

        return back()->with('success', 'Status pesan berhasil diubah.');
    }

    public function destroy(Message $message)
    {
        $message->delete();

        Cache::forget('admin.dashboard.statistics');

        $this->logAudit('delete', 'Message', $message->id);

        return redirect()->route('admin.messages.index')->with('success', 'Pesan berhasil dihapus.');
    }
}
