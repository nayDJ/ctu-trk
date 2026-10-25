<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StorePpidDocumentRequest;
use App\Http\Requests\Admin\UpdatePpidDocumentRequest;
use App\Models\PpidDocument;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Facades\Storage;

class PpidDocumentController extends Controller
{
    use Auditable;

    public function index()
    {
        $documents = PpidDocument::latest()->paginate(15);

        return inertia('Admin/PpidDocuments/Index', ['documents' => $documents]);
    }

    public function store(StorePpidDocumentRequest $request)
    {
        $validated = $request->validated();

        $validated['file_path'] = $request->file('file_path')->store('documents', 'public');

        $ppidDocument = PpidDocument::create($validated);

        $this->logAudit('create', 'PpidDocument', $ppidDocument->id);

        return redirect()->route('admin.ppid-documents.index')->with('success', 'Dokumen PPID berhasil ditambahkan.');
    }

    public function update(UpdatePpidDocumentRequest $request, PpidDocument $ppidDocument)
    {
        $validated = $request->validated();

        if ($request->hasFile('file_path')) {
            Storage::disk('public')->delete($ppidDocument->file_path);
            $validated['file_path'] = $request->file('file_path')->store('documents', 'public');
        } else {
            unset($validated['file_path']);
        }

        $ppidDocument->update($validated);

        $this->logAudit('update', 'PpidDocument', $ppidDocument->id);

        return redirect()->route('admin.ppid-documents.index')->with('success', 'Dokumen PPID berhasil diperbarui.');
    }

    public function publish(PpidDocument $ppidDocument)
    {
        $ppidDocument->update(['is_published' => ! $ppidDocument->is_published]);

        $this->logAudit('status_change', 'PpidDocument', $ppidDocument->id);

        return back()->with('success', 'Status publish berhasil diubah.');
    }

    public function destroy(PpidDocument $ppidDocument)
    {
        Storage::disk('public')->delete($ppidDocument->file_path);
        $ppidDocument->delete();

        $this->logAudit('delete', 'PpidDocument', $ppidDocument->id);

        return redirect()->route('admin.ppid-documents.index')->with('success', 'Dokumen PPID berhasil dihapus.');
    }
}
