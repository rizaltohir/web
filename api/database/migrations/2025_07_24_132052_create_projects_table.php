<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            // Ini adalah kolom-kolom default dari Laravel
            $table->id(); // Kolom ID unik untuk setiap proyek (Primary Key)
            $table->timestamps(); // Kolom created_at dan updated_at secara otomatis

            // ==================================================
            // INI ADALAH KOLOM-KOLOM YANG KITA TAMBAHKAN
            // ==================================================

            $table->string('title'); // Kolom untuk judul proyek (tipe data VARCHAR)
            $table->text('description'); // Kolom untuk deskripsi panjang (tipe data TEXT)
            $table->string('location'); // Kolom untuk lokasi (misal: "Sleman, Yogyakarta")
            $table->string('status')->default('pending'); // Kolom status (misal: pending, active, completed)
            $table->decimal('goal_amount', 15, 2)->nullable(); // Kolom target donasi (bisa kosong)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
