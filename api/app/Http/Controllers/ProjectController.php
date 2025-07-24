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
            'category'    => 'required|string|in:environment,social,education,health,culture,technology,other',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
            'location'    => 'required|string|max:255',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'status'      => 'required|string|in:preparation,ongoing,completed',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

                // Tambahkan user_id ke data yang akan disimpan
        $validatedData['user_id'] = $request->user()->id;
        
        // Convert tags array to JSON string if present
        if (isset($validatedData['tags'])) {
            $validatedData['tags'] = json_encode($validatedData['tags']);
        }

        // Simpan project baru
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
            'category'    => 'required|string|in:environment,social,education,health,culture,technology,other',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
            'location'    => 'required|string|max:255',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'status'      => 'required|string|in:preparation,ongoing,completed',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'goal_amount' => 'nullable|numeric|min:0',
        ]);

        // Convert tags array to JSON string if present
        if (isset($validatedData['tags'])) {
            $validatedData['tags'] = json_encode($validatedData['tags']);
        }

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
