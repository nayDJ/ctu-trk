<?php

namespace Database\Seeders;

use App\Models\Agenda;
use App\Models\User;
use Illuminate\Database\Seeder;

class AgendaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $agendas = [
            [
                'title' => 'Musyawarah Kelurahan Juata Laut',
                'description' => 'Musyawarah warga Kelurahan Juata Laut untuk membahas program pembangunan dan pelayanan masyarakat tahun 2026.',
                'starts_at' => '2026-09-10 09:00:00',
                'ends_at' => '2026-09-10 12:00:00',
                'location' => 'Kantor Kelurahan Juata Laut',
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'title' => 'Sosialisasi Penerimaan CPNS',
                'description' => 'Sosialisasi tata cara pendaftaran dan persyaratan penerimaan Calon Pegawai Negeri Sipil tahun 2026 bagi masyarakat Kecamatan Tarakan Utara.',
                'starts_at' => '2026-09-15 08:00:00',
                'ends_at' => '2026-09-15 11:00:00',
                'location' => 'Aula Kecamatan Tarakan Utara',
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'title' => 'Rapat Evaluasi Program Unggulan',
                'description' => 'Rapat evaluasi capaian program unggulan Kecamatan Tarakan Utara semester I tahun 2026 bersama seluruh stakeholder terkait.',
                'starts_at' => '2026-09-20 13:00:00',
                'ends_at' => '2026-09-20 15:00:00',
                'location' => 'Kantor Kecamatan Tarakan Utara',
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
            [
                'title' => 'Pelatihan Kader Kesehatan Masyarakat',
                'description' => 'Pelatihan peningkatan kapasitas kader kesehatan masyarakat di tiga kelurahan se-Kecamatan Tarakan Utara.',
                'starts_at' => '2026-09-25 08:00:00',
                'ends_at' => '2026-09-25 12:00:00',
                'location' => 'Kantor Kelurahan Juata Permai',
                'is_published' => true,
                'created_by' => $admin?->id,
            ],
        ];

        foreach ($agendas as $data) {
            Agenda::updateOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}
