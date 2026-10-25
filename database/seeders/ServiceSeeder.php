<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::updateOrCreate(
            ['slug' => 'pengaduan-masyarakat'],
            [
                'name' => 'Pengaduan Masyarakat',
                'description' => 'Sampaikan pengaduan masyarakat secara online melalui portal Kecamatan Tarakan Utara. Setiap pengaduan akan ditindaklanjuti oleh petugas sesuai prosedur yang berlaku.',
                'requirements' => "1. Identitas pelapor (nama, alamat, kontak)\n2. Deskripsi pengaduan yang jelas\n3. Bukti pendukung (foto/dokumen) jika ada\n4. Lokasi kejadian pengaduan",
                'estimated_time' => '3-14 hari kerja',
                'procedure' => "1. Buka halaman Pengaduan Masyarakat\n2. Isi formulir pengaduan dengan lengkap\n3. Unggah bukti pendukung jika diperlukan\n4. Kirim pengaduan dan catat nomor tiket\n5. Pantau status pengaduan melalui halaman Cek Status\n6. Tunggu tindak lanjut dari petugas kecamatan",
                'is_published' => true,
            ]
        );

        Service::updateOrCreate(
            ['slug' => 'permohonan-informasi-publik'],
            [
                'name' => 'Permohonan Informasi Publik',
                'description' => 'Ajukan permohonan informasi publik sesuai Undang-Undang Keterbukaan Informasi Publik (PPID). Informasi yang diminta akan diproses sesuai ketentuan peraturan perundang-undangan.',
                'requirements' => "1. Identitas pemohon (nama, alamat, kontak)\n2. Rincian informasi yang diminta\n3. Tujuan penggunaan informasi",
                'estimated_time' => '7 hari kerja',
                'procedure' => "1. Buka halaman Permohonan Informasi Publik\n2. Isi formulir permohonan dengan lengkap\n3. Jelaskan informasi yang dibutuhkan\n4. Kirim permohonan dan catat nomor tiket\n5. Pantau status permohonan melalui halaman Cek Status\n6. Terima informasi yang diminta setelah diverifikasi",
                'is_published' => true,
            ]
        );
    }
}
