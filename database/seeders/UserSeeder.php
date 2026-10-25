<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@kecamatan-tarakan-utara.go.id'],
            [
                'name' => 'Super Admin',
                'password' => 'Admin',
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ],
        );
    }
}
