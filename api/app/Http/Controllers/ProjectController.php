<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::latest()->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string|max:255',
            'latitude'    => 'required|numeric|between:-90,90', // Validasi untuk latitude
            'longitude'   => 'required|numeric|between:-180,180', // Validasi untuk longitude
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

        $validatedData['user_id'] = $request->user()->id;
        $project = Project::create($validatedData);

        return response()->json(['message' => 'Proyek berhasil dibuat!', 'data' => $project], 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        if ($request->user()->id !== $project->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk mengedit proyek ini.'], 403);
        }

        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string|max:255',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

        $project->update($validatedData);

        return response()->json(['message' => 'Proyek berhasil diperbarui!', 'data' => $project]);
    }

    public function destroy(Request $request, Project $project)
    {
        if ($request->user()->id !== $project->user_id) {
            return response()->json(['message' => 'Anda tidak memiliki izin untuk menghapus proyek ini.'], 403);
        }

        $project->delete();
        return response()->json(null, 204);
    }
}
