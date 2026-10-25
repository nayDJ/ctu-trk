<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $posts = [
            [
                'title' => 'Kecamatan Tarakan Utara Gelar Musyawarah Warga',
                'slug' => 'kecamatan-tarakan-utara-gelar-musyawarah-warga',
                'excerpt' => 'Kecamatan Tarakan Utara menggelar musyawarah warga untuk membahas program pembangunan tahun 2026 bersama perwakilan tiga kelurahan.',
                'body' => "Kecamatan Tarakan Utara menggelar musyawarah warga yang dihadiri oleh perwakilan dari tiga kelurahan, yaitu Juata Laut, Juata Permai, dan Juata Kerikil. Musyawarah ini membahas prioritas program pembangunan tahun 2026.\n\nCamat Tarakan Utara dalam sambutannya menyampaikan pentingnya partisipasi aktif masyarakat dalam menentukan arah pembangunan kecamatan. Beberapa program prioritas yang dibahas antara lain peningkatan infrastruktur jalan, penguatan pelayanan publik, dan pengembangan potensi ekonomi masyarakat.\n\nHasil musyawarah akan ditindaklanjuti oleh pemerintah kecamatan sebagai dasar penyusunan rencana kerja tahun berikutnya.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-08-25 08:00:00',
            ],
            [
                'title' => 'Sosialisasi Program Kampung Tangguh di Kelurahan Juata Laut',
                'slug' => 'sosialisasi-program-kampung-tangguh-kelurahan-juata-laut',
                'excerpt' => 'Program Kampung Tangguh resmi diluncurkan di Kelurahan Juata Laut untuk memperkuat ketahanan masyarakat menghadapi bencana.',
                'body' => "Pemerintah Kecamatan Tarakan Utara meluncurkan Program Kampung Tangguh di Kelurahan Juata Laut. Program ini bertujuan untuk memperkuat ketahanan masyarakat dalam menghadapi berbagai potensi bencana.\n\nSosialisasi dihadiri oleh lurah, ketua RT, kader kesehatan, dan warga setempat. Materi yang disampaikan mencakup kesiapsiagaan bencana, pengelolaan sumber daya lokal, dan pembentukan relawan tangguh.\n\nDengan diluncurkannya program ini, diharapkan masyarakat Kelurahan Juata Laut memiliki kemampuan yang lebih baik dalam mengantisipasi dan merespons situasi darurat.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-08-20 09:30:00',
            ],
            [
                'title' => 'Camat Tarakan Utara Tinjau Langsung Proses Pembangunan',
                'slug' => 'camat-tarakan-utara-tinjau-proses-pembangunan',
                'excerpt' => 'Camat Tarakan Utara meninjau langsung progres pembangunan fasilitas publik di beberapa titik wilayah kecamatan.',
                'body' => "Camat Tarakan Utara melakukan peninjauan langsung ke beberapa lokasi pembangunan fasilitas publik yang sedang berlangsung di wilayah kecamatan.\n\nPeninjauan dilakukan untuk memastikan proses pembangunan berjalan sesuai schedule dan memenuhi standar kualitas yang ditetapkan. Beberapa lokasi yang ditinjau antara lain pembangunan jalan lingkungan, perbaikan saluran drainase, dan renovasi fasilitas pelayanan publik.\n\nCamat menyampaikan bahwa pengawasan berkala merupakan bagian penting dari komitmen pemerintah kecamatan untuk memastikan pembangunan dirasakan manfaatnya oleh masyarakat.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-08-15 10:00:00',
            ],
            [
                'title' => 'Pembagian BLT DD Tahap II Kecamatan Tarakan Utara',
                'slug' => 'pembagian-blt-dd-tahap-ii-kecamatan-tarakan-utara',
                'excerpt' => 'Pembagian Bantuan Langsung Tunai dari Dana Desa tahap II telah dilaksanakan untuk warga penerima manfaat di tiga kelurahan.',
                'body' => "Pemerintah Kecamatan Tarakan Utara telah melaksanakan pembagian Bantuan Langsung Tunai (BLT) dari Dana Desa tahap II kepada warga penerima manfaat di tiga kelurahan.\n\nProses pembagian dilakukan secara transparan dan tertib di masing-masing kelurahan. Warga penerima manfaat telah melalui proses verifikasi dan validasi data sesuai dengan kriteria yang berlaku.\n\nDiharapkan bantuan ini dapat membantu meringankan beban ekonomi warga penerima manfaat dan mendorong pemulihan ekonomi di tingkat akar rumput.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-08-10 08:00:00',
            ],
            [
                'title' => 'Gotong Royong Bersama Warga Kelurahan Juata Permai',
                'slug' => 'gotong-royong-bersama-warga-kelurahan-juata-permai',
                'excerpt' => 'Ratusan warga Kelurahan Juata Permai antusias mengikuti gotong royong bersama untuk menjaga kebersihan dan keindahan lingkungan.',
                'body' => "Ratusan warga Kelurahan Juata Permai turun ke jalan mengikuti kegiatan gotong royong bersama yang digelar oleh pemerintah kelurahan. Kegiatan ini merupakan bagian dari program kebersihan lingkungan yang terus digalakkan.\n\nWarga membersihkan saluran drainase, memotong rumput di bahu jalan, dan menata area publik. Kegiatan gotong royong ini juga dihadiri oleh perangkat kelurahan dan tokoh masyarakat.\n\nLurah Juata Permai menyampaikan apresiasi atas antusiasme warga dan berharap semangat gotong royong ini dapat terus dipertahankan untuk mewujudkan lingkungan yang bersih dan nyaman.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-08-05 07:00:00',
            ],
            [
                'title' => 'Rapat Koordinasi Lurah Se-Kecamatan Tarakan Utara',
                'slug' => 'rapat-koordinasi-lurah-se-kecamatan-tarakan-utara',
                'excerpt' => 'Rapat koordinasi bulanan lurah se-Kecamatan Tarakan Utara membahas capaian kinerja dan rencana kerja bulan depan.',
                'body' => "Rapat koordinasi bulanan lurah se-Kecamatan Tarakan Utara telah dilaksanakan di aula kantor kecamatan. Rapat ini dihadiri oleh tiga lurah dari Kelurahan Juata Laut, Juata Permai, dan Juata Kerikil.\n\nAgenda rapat membahas capaian kinerja bulan sebelumnya, permasalahan yang dihadapi di lapangan, dan rencana kerja untuk bulan berikutnya. Beberapa isu strategis yang dibahas antara lain penanganan banjir, pelayanan administrasi kependudukan, dan penguatan peran kader masyarakat.\n\nCamat Tarakan Utara menekankan pentingnya koordinasi yang baik antar kelurahan untuk menciptakan pelayanan publik yang merata dan berkualitas di seluruh wilayah kecamatan.",
                'author_id' => $admin?->id,
                'is_published' => true,
                'published_at' => '2026-07-30 09:00:00',
            ],
        ];

        foreach ($posts as $data) {
            Post::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
