<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Models\Setting;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    use Auditable;

    public function index()
    {
        // ponytail: settings datang dari shared prop HandleInertiaRequests (cached)
        return inertia('Admin/Settings/Index');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'kecamatan_name' => 'nullable|string',
            'kota_name' => 'nullable|string',
            'provinsi_name' => 'nullable|string',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string',
            'email' => 'nullable|string',
            'jam_layanan' => 'nullable|string',
            'camat_name' => 'nullable|string',
            'camat_greeting' => 'nullable|string',
            'maklumat_pelayanan' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'tupoksi' => 'nullable|string',
            'statistik_warga' => 'nullable|string',
            'statistik_rt' => 'nullable|string',
            'statistik_kk' => 'nullable|string',
            'marquee_text' => 'nullable|string',
            'sidebar_logo_text' => 'nullable|string',
            'struktur_organisasi_image' => 'nullable|string',
            'ppid_deskripsi' => 'nullable|string',
            'ppid_profil' => 'nullable|string',
            'ppid_tugas_wewenang' => 'nullable|string',
            'ppid_struktur_image' => 'nullable|string',
            'ppid_visi' => 'nullable|string',
            'ppid_misi' => 'nullable|string',
            'ppid_standar_layanan_judul' => 'nullable|string',
            'ppid_standar_layanan_deskripsi' => 'nullable|string',
            'ppid_standar_layanan_image' => 'nullable|string',
            'ppid_pengumuman' => 'nullable|string',
        ]);

        Setting::setMany($validated);

        Cache::forget('admin.dashboard.statistics');
        foreach (['harian', 'mingguan', 'bulanan', 'tahunan'] as $period) {
            Cache::forget("admin.statistics.{$period}");
        }

        $this->logAudit('update', 'Setting');

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
