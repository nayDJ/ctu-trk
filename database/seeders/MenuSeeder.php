<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $publicMenus = [
            ['label' => 'Beranda', 'href' => '/', 'icon' => 'Home', 'sort_order' => 0],
            ['label' => 'Profil', 'href' => '/profil', 'icon' => 'Building2', 'sort_order' => 1],
            ['label' => 'Layanan', 'href' => '/layanan', 'icon' => 'Layers', 'sort_order' => 2],
            ['label' => 'Informasi', 'href' => '/informasi', 'icon' => 'Info', 'sort_order' => 3],
            ['label' => 'PPID', 'href' => '/ppid', 'icon' => 'FileText', 'sort_order' => 4],
            ['label' => 'SP4N-LAPOR', 'href' => '/sp4n', 'icon' => 'Phone', 'sort_order' => 5],
            ['label' => 'Kontak Kami', 'href' => '/kontak', 'icon' => 'Mail', 'sort_order' => 6],
        ];

        foreach ($publicMenus as $menu) {
            DB::table('menus')->updateOrInsert(
                ['href' => $menu['href'], 'context' => 'public'],
                [...$menu, 'context' => 'public', 'is_active' => true, 'visibility' => 'all', 'created_at' => now(), 'updated_at' => now()],
            );
        }

        $adminSidebar = [
            ['label' => 'Dashboard',           'href' => '/admin',               'icon' => 'ChartBarIcon',              'sort_order' => 0,  'role' => null],
            ['label' => 'Statistik',           'href' => '/admin/statistik',     'icon' => 'ChartPieIcon',              'sort_order' => 1,  'role' => null],
            ['label' => 'Pengaduan',           'href' => '/admin/complaints',    'icon' => 'DocumentTextIcon',          'sort_order' => 2,  'role' => null],
            ['label' => 'Permohonan Info',     'href' => '/admin/info-requests', 'icon' => 'DocumentCheckIcon',         'sort_order' => 3,  'role' => null],
            ['label' => 'Pesan Masuk',         'href' => '/admin/messages',      'icon' => 'EnvelopeIcon',             'sort_order' => 4,  'role' => null],
            ['label' => 'Kategori',            'href' => '/admin/categories',    'icon' => 'TagIcon',                  'sort_order' => 5,  'role' => 'admin,super_admin'],
            ['label' => 'Users',               'href' => '/admin/users',         'icon' => 'UsersIcon',                'sort_order' => 6,  'role' => 'super_admin'],
            ['label' => 'Menus',               'href' => '/admin/menus',         'icon' => 'Bars3Icon',                'sort_order' => 7,  'role' => 'super_admin'],
            ['label' => 'Berita',              'href' => '/admin/posts',         'icon' => 'NewspaperIcon',            'sort_order' => 8,  'role' => null],
            ['label' => 'Agenda',              'href' => '/admin/agendas',       'icon' => 'CalendarDaysIcon',         'sort_order' => 9,  'role' => null],
            ['label' => 'Galeri',              'href' => '/admin/galleries',     'icon' => 'PhotoIcon',                'sort_order' => 10, 'role' => null],
            ['label' => 'Layanan',             'href' => '/admin/services',      'icon' => 'Cog6ToothIcon',            'sort_order' => 11, 'role' => 'admin,super_admin'],
            ['label' => 'Pejabat',             'href' => '/admin/officials',     'icon' => 'UserCircleIcon',           'sort_order' => 12, 'role' => 'admin,super_admin'],
            ['label' => 'Slider Banner',       'href' => '/admin/sliders',       'icon' => 'RectangleStackIcon',       'sort_order' => 13, 'role' => null],
            ['label' => 'Kelurahan',           'href' => '/admin/villages',      'icon' => 'HomeModernIcon',           'sort_order' => 14, 'role' => 'admin,super_admin'],
            ['label' => 'Dokumen PPID',        'href' => '/admin/ppid-documents', 'icon' => 'FolderOpenIcon',           'sort_order' => 15, 'role' => 'admin,super_admin'],
            ['label' => 'Profil & Pengaturan', 'href' => '/admin/profil',        'icon' => 'WrenchScrewdriverIcon',    'sort_order' => 16, 'role' => 'super_admin'],
            ['label' => 'Audit Log',           'href' => '/admin/audit-logs',    'icon' => 'ClipboardDocumentListIcon', 'sort_order' => 17, 'role' => 'admin,super_admin'],
        ];

        foreach ($adminSidebar as $menu) {
            DB::table('menus')->updateOrInsert(
                ['href' => $menu['href'], 'context' => 'admin_sidebar'],
                [...$menu, 'context' => 'admin_sidebar', 'is_active' => true, 'visibility' => 'all', 'created_at' => now(), 'updated_at' => now()],
            );
        }
    }
}
