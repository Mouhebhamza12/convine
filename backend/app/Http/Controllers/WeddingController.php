<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $wedding = $this->resolveWedding($request);

        $this->authorize('view', $wedding);

        $wedding->load('guests');

        return response()->json([
            'wedding' => $this->formatWedding($wedding),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $wedding = $this->resolveWedding($request);

        $this->authorize('update', $wedding);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'bride_name' => ['nullable', 'string', 'max:255'],
            'groom_name' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', 'string', 'in:draft,ready,sent'],
        ]);

        $wedding->update($data);

        return response()->json([
            'wedding' => $this->formatWedding($wedding->fresh('guests')),
        ]);
    }

    private function resolveWedding(Request $request): Wedding
    {
        $user = $request->user();

        if ($user->isAdmin() && $request->filled('wedding_id')) {
            return Wedding::query()->findOrFail($request->integer('wedding_id'));
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            abort(404, 'No wedding found for this account.');
        }

        return $wedding;
    }

    private function formatWedding(Wedding $wedding): array
    {
        return [
            'id' => $wedding->id,
            'title' => $wedding->title,
            'bride_name' => $wedding->bride_name,
            'groom_name' => $wedding->groom_name,
            'event_date' => $wedding->event_date?->toDateString(),
            'venue' => $wedding->venue,
            'template_slug' => $wedding->template_slug,
            'message' => $wedding->message,
            'status' => $wedding->status,
            'guests' => $wedding->guests->map(fn ($guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'sort_order' => $guest->sort_order,
            ])->values(),
        ];
    }
}
