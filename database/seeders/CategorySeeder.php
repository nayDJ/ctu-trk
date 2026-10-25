<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Infrastruktur',
            'Kebersihan',
            'Keamanan',
            'Pelayanan Publik',
            'Lingkungan',
            'Fasilitas Umum',
            'Lainnya',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            );
        }
    }
}
