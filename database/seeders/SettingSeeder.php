<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'kecamatan_name' => 'Kecamatan Tarakan Utara',
            'kota_name' => 'Kota Tarakan',
            'provinsi_name' => 'Kalimantan Utara',
            'alamat' => 'Jl. Raja Gibran, Karang Rejo, Kec. Tarakan Utara, Kota Tarakan, Kalimantan Utara',
            'telepon' => '(0551) 31912',
            'email' => 'kecamatan.tarakanutara@tarakan.go.id',
            'jam_layanan' => 'Senin - Jumat, 08:00 - 16:00 WITA',
            'camat_name' => 'Dr. H. Ahmad Ali, M.Si',
            'camat_greeting' => 'Selamat datang di website resmi CTU - Kecamatan Tarakan Utara. Kami berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat.',
            'visi' => 'Terwujudnya Kecamatan Tarakan Utara yang Maju, Mandiri, dan Sejahtera',
            'misi' => '1. Meningkatkan kualitas pelayanan publik\n2. Mengembangkan potensi wilayah dan masyarakat\n3. Memperkuat partisipasi masyarakat dalam pembangunan',
            'tupoksi' => 'Penyelenggaraan pemerintahan, pembangunan, kemasyarakatan, dan pelayanan publik di tingkat kecamatan',
            'statistik_warga' => '15000',
            'statistik_rt' => '45',
            'statistik_kk' => '5200',
            'sidebar_logo_text' => 'Admin',
        ];

        foreach ($settings as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'created_at' => now(), 'updated_at' => now()],
            );
        }
    }
}
