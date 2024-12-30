<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Preference;


class PreferenceController extends Controller
{
    public function updateOrCreatePreferences(Request $request)
    {
        $validated = $request->validate([
            'category' => 'nullable|array',
            'category.*' => 'integer', 
            'source' => 'nullable|array',
            'source.*' => 'string', 
            'author' => 'nullable|array',
            'author.*' => 'string', 
        ]);

        $user = auth()->user(); 

        $preferences = $user->preferences()->updateOrCreate(
            ['user_id' => $user->id], 
            [
                'category' => $validated['category'] ?? null,
                'source' => $validated['source'] ?? null,
                'author' => $validated['author'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Preferences updated successfully.',
            'preferences' => $preferences
        ]);
    }
}
