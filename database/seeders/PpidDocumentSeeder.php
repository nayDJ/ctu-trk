<?php

namespace Database\Seeders;

use App\Models\PpidDocument;
use Illuminate\Database\Seeder;

class PpidDocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            [
                'title' => 'Rencana Strategis (Renstra) Kecamatan Tarakan Utara Tahun 2025-2029',
                'description' => null,
                'file_path' => 'ppid/renstra-ktu-2025-2029.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'LAPORAN REALISASI FISIK DAN KEUANGAN KECAMATAN TARAKAN UTARA 2026',
                'description' => 'Januari s.d. Juli 2026',
                'file_path' => 'ppid/realisasi-fisik-keuangan-2026.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'LAPORAN KONSOLIDASI KECAMATAN TARAKAN UTARA BULAN JULI 2026',
                'description' => null,
                'file_path' => 'ppid/konsolidasi-juli-2026.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Daftar Aset 2025',
                'description' => null,
                'file_path' => 'ppid/daftar-aset-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Laporan Keuangan Kecamatan Tarakan Utara 2025',
                'description' => null,
                'file_path' => 'ppid/laporan-keuangan-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Laporan Kinerja Instansi Pemerintah (LKIP) 2025',
                'description' => null,
                'file_path' => 'ppid/lkip-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Laporan Harta Kekayaan Negara [LHKPN]',
                'description' => null,
                'file_path' => 'ppid/lhkpn-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Pengadaan Barang dan Jasa 2025 (SIRUP)',
                'description' => null,
                'file_path' => 'ppid/sirup-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Dokumen Pelaksanaan Anggaran [DPA] 2026',
                'description' => null,
                'file_path' => 'ppid/dpa-2026.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Rencana Kerja (RENJA) 2026',
                'description' => null,
                'file_path' => 'ppid/renja-2026.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'Rencana Kegiatan dan Anggaran [RKA] 2025',
                'description' => null,
                'file_path' => 'ppid/rka-2025.pdf',
                'category' => 'berkala',
                'is_published' => true,
            ],
            [
                'title' => 'STRUKTUR ORGANISASI DAN TATA KERJA KECAMATAN TARAKAN UTARA',
                'description' => 'SOTK Terbaru',
                'file_path' => 'ppid/sotk-ktu.pdf',
                'category' => 'serta_merta',
                'is_published' => true,
            ],
            [
                'title' => 'Visi dan Misi Kecamatan Tarakan Utara',
                'description' => null,
                'file_path' => 'ppid/visi-misi-ktu.pdf',
                'category' => 'serta_merta',
                'is_published' => true,
            ],
            [
                'title' => 'Daftar Nama Pejabat dan Staf Kecamatan Tarakan Utara',
                'description' => null,
                'file_path' => 'ppid/daftar-pejabat-ktu.pdf',
                'category' => 'serta_merta',
                'is_published' => true,
            ],
            [
                'title' => 'PETA ZONA MAKLUMAT PUBLIK',
                'description' => null,
                'file_path' => 'ppid/zona-maklumat-publik.pdf',
                'category' => 'serta_merta',
                'is_published' => true,
            ],
        ];

        foreach ($documents as $data) {
            PpidDocument::updateOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}
