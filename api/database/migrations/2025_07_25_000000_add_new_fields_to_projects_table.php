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
        Schema::table('projects', function (Blueprint $table) {
            // Tambah kolom category
            $table->string('category')->default('other');
            
            // Tambah kolom tags (akan disimpan sebagai JSON)
            $table->json('tags')->nullable();
            
            // Update kolom status dengan enum values yang baru
            $table->string('status')->default('preparation')->change();
            
            // Tambah kolom timeline dengan nilai default hari ini
            $table->date('start_date')->default(now());
            $table->date('end_date')->default(now()->addDays(30));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['category', 'tags', 'start_date', 'end_date']);
            $table->string('status')->default('pending')->change();
        });
    }
};
