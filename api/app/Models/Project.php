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
        'category',
        'tags',
        'status',
        'start_date',
        'end_date',
        'goal_amount',
        'user_id',
        'latitude',
        'longitude',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Daftar kategori yang tersedia
     */
    public static $categories = [
        'environment' => 'Lingkungan',
        'social' => 'Sosial',
        'education' => 'Pendidikan',
        'health' => 'Kesehatan',
        'culture' => 'Budaya',
        'technology' => 'Teknologi',
        'other' => 'Lainnya'
    ];

    /**
     * Daftar status yang tersedia
     */
    public static $statuses = [
        'preparation' => 'Persiapan',
        'ongoing' => 'Sedang Berjalan',
        'completed' => 'Selesai'
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
