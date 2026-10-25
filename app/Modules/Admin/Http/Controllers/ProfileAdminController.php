<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\Setting;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileAdminController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: settings sudah dishare global via HandleInertiaRequests, tanpa query ganda di sini
        return inertia('Admin/Profile/Index');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'kecamatan_name' => 'nullable|string|max:255',
            'kota_name' => 'nullable|string|max:255',
            'provinsi_name' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'jam_layanan' => 'nullable|string|max:255',
            'camat_name' => 'nullable|string|max:255',
            'camat_greeting' => 'nullable|string',
            'maklumat_pelayanan' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'tupoksi' => 'nullable|string',
            'struktur_organisasi_image' => 'nullable|file|image|max:5120',
            'ppid_deskripsi' => 'nullable|string',
            'ppid_profil' => 'nullable|string',
            'ppid_tugas_wewenang' => 'nullable|string',
            'ppid_struktur_image' => 'nullable|file|image|max:5120',
            'ppid_visi' => 'nullable|string',
            'ppid_misi' => 'nullable|string',
            'ppid_standar_layanan_judul' => 'nullable|string|max:255',
            'ppid_standar_layanan_deskripsi' => 'nullable|string',
            'ppid_standar_layanan_image' => 'nullable|file|image|max:5120',
            'ppid_pengumuman' => 'nullable|string',
        ]);

        $imageFields = ['struktur_organisasi_image', 'ppid_struktur_image', 'ppid_standar_layanan_image'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $old = Setting::getValue($field);
                if ($old && Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }
                $path = $request->file($field)->store('struktur', 'public');
                $validated[$field] = $path;
            } else {
                unset($validated[$field]);
            }
        }

        // ponytail: 1 query upsert untuk semua key yang ada di $validated (field file absen sudah di-unset di atas)
        Setting::setMany($validated);

        $this->logAudit('update', 'Setting');

        return back()->with('success', 'Profil kecamatan berhasil disimpan.');
    }
}
