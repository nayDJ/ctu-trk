<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Complaint;
use App\Models\User;
use App\Modules\Complaint\Enums\ComplaintStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $categories = Category::pluck('id', 'name');

        if ($categories->isEmpty()) {
            return;
        }

        $complaints = [
            [
                'title' => 'Jalan Rusak Parah di RT 05 Karang Rejo',
                'description' => 'Jalan utama menuju RT 05 Karang Rejo mengalami kerusakan parah. Lubang-lubang besar menganga di tengah jalan, sangat membahayakan pengendara尤其是 pada malam hari. Beberapa warga sudah menjadi korban kecelakaan.',
                'location' => 'Jl. Merdeka, RT 05, Karang Rejo',
                'category' => 'Infrastruktur',
                'status' => ComplaintStatus::COMPLETED,
                'reporter_name' => 'Budi Santoso',
                'reporter_phone' => '081234567890',
                'reporter_email' => 'budi.santoso@gmail.com',
                'reporter_address' => 'Jl. Merdeka No. 12, RT 05, Karang Rejo',
                'is_anonymous' => false,
                'note' => 'Sudah ditindaklanjuti oleh Dinas Pekerjaan Umum. Perbaikan jalan selesai dilakukan.',
            ],
            [
                'title' => 'Sampah Menumpuk di Pasar Karang Anyar',
                'description' => 'Tumpukan sampah di sekitar Pasar Karang Anyar sudah menggunung 3 hari tidak diangkut. Bau tidak sedap sudah mulai mengganggu pedagang dan pengunjung pasar. Diperlukan segera pengangkutan sampah.',
                'location' => 'Pasar Karang Anyar, Kel. Karang Anyar',
                'category' => 'Kebersihan',
                'status' => ComplaintStatus::PROCESSING,
                'reporter_name' => 'Siti Rahmawati',
                'reporter_phone' => '085678901234',
                'reporter_email' => 'siti.rahma@yahoo.com',
                'reporter_address' => 'Jl. Pasar Baru No. 5, Karang Anyar',
                'is_anonymous' => false,
                'note' => 'Sudah dikordinasikan dengan DLH Kota Tarakan.jadwal pengangkutan hari Senin.',
            ],
            [
                'title' => 'Lampu Jalan Mati di Jl. Sudirman',
                'description' => 'Sebanyak 15 tiang lampu jalan di sepanjang Jl. Sudirman dari simpang lima hingga bundaran sudah mati selama 2 minggu. Kondisi gelap malam hari sangat membahayakan pejalan kaki dan pengendara.',
                'location' => 'Jl. Sudirman, RT 03 - RT 07',
                'category' => 'Infrastruktur',
                'status' => ComplaintStatus::VERIFIED,
                'reporter_name' => 'Ahmad Fauzi',
                'reporter_phone' => '087890123456',
                'reporter_email' => null,
                'reporter_address' => 'Jl. Sudirman No. 28, RT 04',
                'is_anonymous' => false,
                'note' => 'Laporan sudah diverifikasi. Menunggu koordinasi dengan PLN.',
            ],
            [
                'title' => 'Banjir di Perumahan Taman Sari',
                'description' => 'Perumahan Taman Sari RT 10 dan RT 11 terendam banjir setinggi 50cm setelah hujan deras. Saluran drainase tersumbat oleh sampah dan endapan lumpur. Beberapa rumah terendam hingga masuk ke dalam rumah.',
                'location' => 'Perumahan Taman Sari, RT 10-11, Kel. Tanjung Selor',
                'category' => 'Lingkungan',
                'status' => ComplaintStatus::SUBMITTED,
                'reporter_name' => 'Dewi Lestari',
                'reporter_phone' => '082345678901',
                'reporter_email' => 'dewi.lestari@gmail.com',
                'reporter_address' => 'Jl. Taman Sari No. 7, RT 10',
                'is_anonymous' => false,
                'note' => null,
            ],
            [
                'title' => 'Lampu Penerangan Jalan Umum Mati',
                'description' => '3 tiang lampu di Jl. P. Diponegoro depan SDN 005 mati total. Anak-anak sekolah harus melewati jalan gelap saat pulang sekolah pada sore hari.',
                'location' => 'Jl. P. Diponegoro, depan SDN 005',
                'category' => 'Infrastruktur',
                'status' => ComplaintStatus::REJECTED,
                'reporter_name' => 'Anonim',
                'reporter_phone' => '-',
                'reporter_email' => null,
                'reporter_address' => null,
                'is_anonymous' => true,
                'note' => 'Lampu PJU sudah menjadi kewenangan PLN, bukan ranah kecamatan.',
            ],
            [
                'title' => 'Pungutan Liar di Kantor Kelurahan',
                'description' => 'Ada pungutan tidak resmi sebesar Rp 50.000 untuk pengurusan surat pengantar. Padahal seharusnya gratis. Saya sudah siapkan bukti kwitansi.',
                'location' => 'Kantor Kelurahan Karang Rejo',
                'category' => 'Pelayanan Publik',
                'status' => ComplaintStatus::COMPLETED,
                'reporter_name' => 'Rahmat Hidayat',
                'reporter_phone' => '083456789012',
                'reporter_email' => 'rahmat.hidayat@outlook.com',
                'reporter_address' => 'Jl. Pahlawan No. 15, RT 02, Karang Rejo',
                'is_anonymous' => false,
                'note' => 'Investigasi dilakukan. Oknum petugas sudah diberi peringatan dan pembinaan.',
            ],
            [
                'title' => 'Pohon Tumbang di Jl. Gatot Subroto',
                'description' => 'Pohon besar tumbang menutupi separuh badan jalan di Jl. Gatot Subroto setelah angin kencang tadi malam. Lalu lintas terganggu, mobil harus bergantian melintas.',
                'location' => 'Jl. Gatot Subroto, RT 06, Karang Rejo',
                'category' => 'Lingkungan',
                'status' => ComplaintStatus::PROCESSING,
                'reporter_name' => 'Firmansyah',
                'reporter_phone' => '084567890123',
                'reporter_email' => null,
                'reporter_address' => 'Jl. Gatot Subroto No. 9, RT 06',
                'is_anonymous' => false,
                'note' => 'Tim BPBD sudah standby. Pemotongan pohon dilakukan besok pagi.',
            ],
            [
                'title' => 'Air Bersih Tidak Mengalir di RT 09',
                'description' => 'Sudah 5 hari air PDAM tidak mengalir di RT 09 Kel. Tanjung Selor. Warga harus mengambil air dari tetangga yang punya sumur. Mohon segera ditindaklanjuti.',
                'location' => 'RT 09, Kel. Tanjung Selor',
                'category' => 'Pelayanan Publik',
                'status' => ComplaintStatus::VERIFIED,
                'reporter_name' => 'Rina Wati',
                'reporter_phone' => '089012345678',
                'reporter_email' => 'rina.wati@gmail.com',
                'reporter_address' => 'Jl. Tanjung Selor No. 22, RT 09',
                'is_anonymous' => false,
                'note' => 'Sudah dikonfirmasi ke PDAM. Ada gangguan pipa induk, sedang diperbaiki.',
            ],
            [
                'title' => 'Marka Jalan Pudar di Simpang Lima',
                'description' => 'Marka jalan (zebra cross) di Simpang Lima sudah sangat pudar dan hampir tidak terlihat. Pengendara motor dan mobil sering tidak memberikan jalan pada pejalan kaki.',
                'location' => 'Simpang Lima, Jl. Sudirman x Jl. Merdeka',
                'category' => 'Infrastruktur',
                'status' => ComplaintStatus::SUBMITTED,
                'reporter_name' => 'Anonim',
                'reporter_phone' => '-',
                'reporter_email' => null,
                'reporter_address' => null,
                'is_anonymous' => true,
                'note' => null,
            ],
            [
                'title' => 'Demo Penggunaan Anggaran Kelurahan',
                'description' => 'Masyarakat RT 12 meminta transparansi penggunaan anggaran kelurahan tahun 2025. Beberapa program yang dijanjikan belum terealisasi.',
                'location' => 'Kantor Kelurahan Karang Anyar',
                'category' => 'Pelayanan Publik',
                'status' => ComplaintStatus::COMPLETED,
                'reporter_name' => 'Hendra Kurniawan',
                'reporter_phone' => '086789012345',
                'reporter_email' => 'hendra.k@gmail.com',
                'reporter_address' => 'Jl. Karang Anyar No. 30, RT 12',
                'is_anonymous' => false,
                'note' => 'Musyawarah sudah dilakukan. Penjelasan anggaran sudah diberikan secara transparan.',
            ],
        ];

        foreach ($complaints as $data) {
            $category = $categories[$data['category']] ?? $categories->first();

            $complaint = Complaint::create([
                'ticket' => 'CTU-'.strtoupper(Str::random(5)),
                'tracking_code' => strtoupper(Str::random(5)),
                'category_id' => $category,
                'reporter_name' => $data['reporter_name'],
                'reporter_phone' => $data['reporter_phone'],
                'reporter_email' => $data['reporter_email'],
                'reporter_address' => $data['reporter_address'],
                'is_anonymous' => $data['is_anonymous'],
                'title' => $data['title'],
                'description' => $data['description'],
                'location' => $data['location'],
                'status' => $data['status'],
            ]);

            $complaint->histories()->create([
                'status' => $data['status']->value,
                'note' => $data['note'] ?? 'Pengaduan berhasil dikirim.',
                'admin_id' => $data['status'] !== ComplaintStatus::SUBMITTED ? $admin?->id : null,
            ]);
        }
    }
}
