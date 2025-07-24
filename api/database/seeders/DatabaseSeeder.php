<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema; // <-- Impor Schema

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Matikan sementara foreign key checks
        Schema::disableForeignKeyConstraints();

        // 2. Panggil seeder-seeder kita.
        // Urutan ini penting: User harus ada dulu sebelum Project dibuat.
        $this->call([
            UserSeeder::class,
            ProjectSeeder::class,
        ]);

        // 3. Nyalakan kembali foreign key checks
        Schema::enableForeignKeyConstraints();
    }
}
