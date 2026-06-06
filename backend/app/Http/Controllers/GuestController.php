<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function sync(Request $request): JsonResponse
    {
        $wedding = $request->user()->wedding;

        if (! $wedding) {
            abort(404, 'No wedding found for this account.');
        }

        $this->authorize('update', $wedding);

        $data = $request->validate([
            'names' => ['required', 'array', 'min:1'],
            'names.*' => ['required', 'string', 'max:255'],
        ]);

        $names = collect($data['names'])
            ->map(fn (string $name) => trim($name))
            ->filter()
            ->unique()
            ->values();

        $wedding->guests()->delete();

        $guests = $names->map(function (string $name, int $index) use ($wedding) {
            return $wedding->guests()->create([
                'name' => $name,
                'sort_order' => $index,
            ]);
        });

        return response()->json([
            'guests' => $guests->map(fn (Guest $guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'sort_order' => $guest->sort_order,
            ])->values(),
        ]);
    }
}
