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

            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->string('category')->default('other');
            $table->json('tags')->nullable();
            $table->string('status')->default('preparation');
            $table->date('start_date')->default(now());
            $table->date('end_date')->default(now()->addDays(30));
            $table->decimal('goal_amount', 15, 2)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
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
