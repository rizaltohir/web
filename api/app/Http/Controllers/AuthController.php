<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Mendaftarkan pengguna baru.
     */
    public function register(Request $request)
    {
        // 1. Validasi data input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // 2. Buat pengguna baru di database
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // Enkripsi password!
        ]);

        // 3. Kembalikan respons sukses
        return response()->json([
            'message' => 'Registrasi berhasil!',
            'user' => $user
        ], 201);
    }
    // ... (kode 'use' dan method 'register' yang sudah ada) ...

/**
 * Mengotentikasi pengguna dan membuat token.
 */
public function login(Request $request)
{
    // 1. Validasi data input
    $credentials = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    // 2. Coba untuk mengotentikasi pengguna
    if (!Auth::attempt($credentials)) {
        // Jika kredensial tidak cocok, kirim respons error
        return response()->json([
            'message' => 'Email atau password salah.'
        ], 401); // 401 adalah kode status "Unauthorized"
    }

    // 3. Jika otentikasi berhasil, buat token baru
    $user = $request->user(); // Dapatkan model pengguna yang sedang login
    
    // Hapus token lama (jika ada) untuk memastikan hanya ada satu sesi aktif
    $user->tokens()->delete(); 
    
    // Buat token baru untuk pengguna ini
    $token = $user->createToken('auth_token')->plainTextToken;

    // 4. Kembalikan respons sukses beserta token
    return response()->json([
        'message' => 'Login berhasil!',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ]);
}

public function logout(Request $request)
{
    // Hapus token otentikasi pengguna saat ini
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout berhasil!'
    ]);
}
}
