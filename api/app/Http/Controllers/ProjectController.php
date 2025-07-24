<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Menampilkan daftar semua proyek.
     */
    public function index()
    {
        // Ambil semua proyek, urutkan dari yang terbaru
        $projects = Project::latest()->get();
        return response()->json($projects);
    }

    /**
     * Menyimpan proyek baru ke database.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

        // Tambahkan ID pengguna yang sedang login sebagai pemilik proyek
        $validatedData['user_id'] = $request->user()->id;

        $project = Project::create($validatedData);

        return response()->json([
            'message' => 'Proyek berhasil dibuat!',
            'data' => $project
        ], 201);
    }

    /**
     * Menampilkan satu proyek spesifik.
     */
    public function show(Project $project)
    {
        return response()->json($project);
    }

    /**
     * Memperbarui proyek yang sudah ada.
     */
    public function update(Request $request, Project $project)
    {
        // --- OTORISASI: Periksa kepemilikan ---
        if ($request->user()->id !== $project->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk mengedit proyek ini.'], 403);
        }

        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string|max:255',
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

        $project->update($validatedData);

        return response()->json([
            'message' => 'Proyek berhasil diperbarui!',
            'data'    => $project
        ]);
    }

    /**
     * Menghapus proyek.
     */
    public function destroy(Request $request, Project $project)
    {
        // --- OTORISASI: Periksa kepemilikan ---
        if ($request->user()->id !== $project->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menghapus proyek ini.'], 403);
        }

        $project->delete();

        return response()->json(null, 204);
    }
}
