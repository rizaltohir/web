<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::truncate();

        // Ambil pengguna pertama yang ada di database
        $user = User::first();

        // Buat proyek-proyek yang dimiliki oleh pengguna tersebut
        Project::create([
            'user_id' => $user->id,
            'title' => 'Gerakan Tanam 1000 Pohon di Lereng Merapi',
            'description' => 'Sebuah inisiatif untuk menghijaukan kembali area yang terdampak erupsi.',
            'location' => 'Sleman, Yogyakarta',
            'status' => 'active',
            'goal_amount' => 5000000.00
        ]);

        Project::create([
            'user_id' => $user->id,
            'title' => 'Bengkel Sampah Organik Komunitas Ibu PKK',
            'description' => 'Mengolah sampah organik dari rumah tangga menjadi kompos.',
            'location' => 'Bantul, Yogyakarta',
            'status' => 'pending',
            'goal_amount' => 1500000.00
        ]);
    }
}
