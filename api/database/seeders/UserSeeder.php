<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama untuk menghindari duplikat
        User::truncate();

        // Buat satu pengguna contoh
        User::create([
            'name' => 'wira icikiwir',
            'email' => 'peler@gmail.com',
            'password' => Hash::make('password123'), // passwordnya adalah 'password'
        ]);
    }
}
