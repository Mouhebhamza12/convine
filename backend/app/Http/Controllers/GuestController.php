<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuestController extends Controller
{
    public function sync(Request $request): JsonResponse
    {
        $wedding = $request->user()->wedding;

        if (! $wedding) {
            abort(404, 'No wedding found for this account.');
        }

        $this->authorize('update', $wedding);

        // The full desired guest list, each row carrying its stable id (or null
        // for a brand-new guest). Identity is the id, never the name — so two
        // guests may share a name, and renaming one never disturbs the link
        // already shared with them or the RSVP they have given.
        $data = $request->validate([
            'guests' => ['present', 'array'],
            'guests.*.id' => ['nullable', 'integer'],
            'guests.*.name' => ['required', 'string', 'max:255'],
        ]);

        $existing = $wedding->guests()->get()->keyBy('id');
        $keptIds = [];

        $guests = collect($data['guests'])
            ->map(fn (array $row) => ['id' => $row['id'] ?? null, 'name' => trim($row['name'])])
            ->filter(fn (array $row) => $row['name'] !== '')
            ->values()
            ->map(function (array $row, int $index) use ($wedding, $existing, &$keptIds) {
                $current = $row['id'] !== null ? $existing->get($row['id']) : null;

                if ($current) {
                    $current->update(['name' => $row['name'], 'sort_order' => $index]);
                    $keptIds[] = $current->id;

                    return $current;
                }

                $guest = $wedding->guests()->create([
                    'name' => $row['name'],
                    'sort_order' => $index,
                    'token' => (string) Str::uuid(),
                    'rsvp_status' => null,
                ]);
                $keptIds[] = $guest->id;

                return $guest;
            });

        // Drop the guests the customer removed from the list.
        $wedding->guests()->whereNotIn('id', $keptIds ?: [0])->delete();

        return response()->json([
            'guests' => $guests->map(fn (Guest $guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'sort_order' => $guest->sort_order,
                'token' => $guest->token,
                'rsvp_status' => $guest->rsvp_status,
                'invite_url' => '/invite/'.$guest->token,
            ])->values(),
        ]);
    }
}
