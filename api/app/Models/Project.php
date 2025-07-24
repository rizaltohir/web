<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'location',
        'status', // Pastikan status juga ada di sini jika Anda menggunakannya
        'goal_amount',
        'user_id', // <-- PENTING
        'latitude',   // <-- Tambahkan ini
        'longitude',  // <-- Tambahkan ini
    ];

    /**
     * Mendefinisikan relasi "belongsTo" ke model User.
     * Setiap Proyek dimiliki oleh satu User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
