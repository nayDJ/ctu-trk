<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            MenuSeeder::class,
            SettingSeeder::class,
            ComplaintSeeder::class,
            ServiceSeeder::class,
            PostSeeder::class,
            AgendaSeeder::class,
            PpidDocumentSeeder::class,
        ]);
    }
}
