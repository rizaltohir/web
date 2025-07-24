<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sinilah Anda dapat mendaftarkan rute web untuk aplikasi Anda.
| Rute-rute ini dimuat oleh RouteServiceProvider dan semuanya akan
| ditugaskan ke grup middleware "web". Buat sesuatu yang hebat!
|
*/

// Rute ini menampilkan halaman selamat datang default Laravel.
// Ini adalah rute yang sudah ada dari awal.
Route::get('/', function () {
    return view('welcome');
});


// ===================================================================
// INI ADALAH RUTE BARU YANG KITA TAMBAHKAN UNTUK LATIHAN
// ===================================================================

// Rute ini akan merespons jika Anda mengunjungi: http://127.0.0.1:8000/halo
Route::get('/halo', function ( ) {
    // Perintah ini hanya mengembalikan teks biasa ke browser.
    return 'Halo! Ini adalah halaman pertama saya di Laravel.';
});

// Rute ini akan merespons jika Anda mengunjungi: http://127.0.0.1:8000/info-proyek
Route::get('/info-proyek', function ( ) {
    // Perintah ini mengembalikan sebuah array PHP,
    // dan Laravel secara otomatis akan mengubahnya menjadi format JSON.
    return [
        'nama_proyek' => 'SatuBumi',
        'deskripsi' => 'Platform Kolaborasi Komunitas untuk Keberlanjutan Lokal',
        'tim' => [
            'backend' => 'Rizal Achmad Thohir',
            'frontend' => 'Devano Danendra Sharen'
        ],
        'status' => 'Pengembangan Backend Dimulai'
    ];
});

