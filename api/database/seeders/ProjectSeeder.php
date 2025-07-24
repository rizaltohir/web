<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User; // <-- Pastikan User diimpor

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus semua data proyek lama untuk menghindari duplikasi saat seeding ulang
        Project::truncate();

        // Ambil pengguna pertama yang ada di database (dibuat oleh UserSeeder)
        // Jika tidak ada user, hentikan seeder untuk menghindari error.
        $user = User::first();
        if (!$user) {
            $this->command->error('Tidak ada pengguna ditemukan. Jalankan UserSeeder terlebih dahulu.');
            return;
        }

        // Buat data proyek contoh pertama
        Project::create([
            'user_id'     => $user->id,
            'title'       => 'Gerakan Tanam 1000 Pohon di Lereng Merapi',
            'description' => 'Sebuah inisiatif untuk menghijaukan kembali area yang terdampak erupsi dan mencegah longsor. Dibutuhkan relawan untuk penanaman dan perawatan.',
            'location'    => 'Sleman, Yogyakarta',
            'latitude'    => -7.69950000,  // Koordinat untuk area Sleman
            'longitude'   => 110.42100000, // Koordinat untuk area Sleman
            'status'      => 'active',
            'goal_amount' => 5000000.00
        ]);

        // Buat data proyek contoh kedua
        Project::create([
            'user_id'     => $user->id,
            'title'       => 'Bengkel Sampah Organik Komunitas Ibu PKK',
            'description' => 'Mengolah sampah organik dari rumah tangga menjadi kompos bernilai jual. Mencari mitra untuk distribusi dan pemasaran kompos.',
            'location'    => 'Bantul, Yogyakarta',
            'latitude'    => -7.89390000,  // Koordinat untuk area Bantul
            'longitude'   => 110.32040000, // Koordinat untuk area Bantul
            'status'      => 'pending',
            'goal_amount' => 1500000.00
        ]);
        
        // Buat data proyek contoh ketiga
        Project::create([
            'user_id'     => $user->id,
            'title'       => 'Kelas Digital Gratis untuk Anak-Anak Pesisir',
            'description' => 'Memberikan pelatihan dasar komputer dan internet untuk anak-anak di wilayah pesisir agar siap menghadapi era digital.',
            'location'    => 'Gunungkidul, Yogyakarta',
            'latitude'    => -8.14530000,  // Koordinat untuk area Gunungkidul
            'longitude'   => 110.60000000, // Koordinat untuk area Gunungkidul
            'status'      => 'active',
            'goal_amount' => null // Contoh proyek tanpa target donasi
        ]);
    }
}
