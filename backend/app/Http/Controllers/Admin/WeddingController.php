<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function index(): JsonResponse
    {
        $weddings = Wedding::query()
            ->with(['owner:id,name,email', 'guests'])
            ->latest()
            ->get()
            ->map(fn (Wedding $wedding) => $this->formatWedding($wedding));

        return response()->json(['weddings' => $weddings]);
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
            'guest_count' => $wedding->guests->count(),
            'owner' => [
                'id' => $wedding->owner->id,
                'name' => $wedding->owner->name,
                'email' => $wedding->owner->email,
            ],
        ];
    }
}
