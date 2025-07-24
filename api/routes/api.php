<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AuthController;

// ===================================================================
// RUTE PUBLIK (Tidak Perlu Login)
// ===================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rute untuk melihat semua proyek dan detailnya tetap publik
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);


// ===================================================================
// RUTE TERPROTEKSI (HARUS Login dan Mengirim Token)
// ===================================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute untuk mendapatkan data pengguna yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rute untuk logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute untuk membuat, memperbarui, dan menghapus proyek
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
});
