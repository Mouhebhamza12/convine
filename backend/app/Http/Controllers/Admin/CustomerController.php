<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wedding;
use App\Services\CustomerProvisioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * List every customer with their wedding, credentials, status and RSVP counts.
     */
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));

        $weddings = Wedding::query()
            ->with(['owner', 'guests'])
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';
                $query->where(fn ($q) => $q
                    ->where('title', 'like', $like)
                    ->orWhereHas('owner', fn ($o) => $o
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)));
            })
            ->latest()
            ->get()
            ->map(fn (Wedding $wedding) => $this->formatCustomer($wedding));

        return response()->json([
            'summary' => [
                'customers' => $weddings->count(),
                'paid' => $weddings->where('paid', true)->count(),
                'published' => $weddings->where('published', true)->count(),
                'accepted' => $weddings->sum('accepted_count'),
                'pending' => $weddings->sum('pending_count'),
            ],
            'customers' => $weddings->values(),
        ]);
    }

    public function show(Wedding $wedding): JsonResponse
    {
        return response()->json([
            'customer' => $this->formatCustomer($wedding->load(['owner', 'guests'])),
        ]);
    }

    public function store(Request $request, CustomerProvisioner $provisioner): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'email_local' => ['nullable', 'string', 'max:64', 'regex:/^[a-z0-9._-]+$/i'],
            'template_slug' => ['nullable', 'string', 'max:64'],
            'slug' => ['nullable', 'string', 'max:255'],
            'bride_name' => ['nullable', 'string', 'max:255'],
            'groom_name' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
        ]);

        $result = $provisioner->create($request->user(), $data);

        return response()->json([
            'customer' => $this->formatCustomer($result['wedding']->fresh(['owner', 'guests'])),
            'password' => $result['password'],
        ], 201);
    }

    /**
     * Owner edits a customer's invitation: template, publish state, paid, and content.
     */
    public function update(Request $request, Wedding $wedding): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'title' => ['sometimes', 'string', 'max:255'],
            'template_slug' => ['sometimes', 'string', 'max:64'],
            'status' => ['sometimes', 'string', 'in:draft,ready,sent'],
            'paid' => ['sometimes', 'boolean'],
            'bride_name' => ['nullable', 'string', 'max:255'],
            'groom_name' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'string', 'max:20'],
            'venue' => ['nullable', 'string', 'max:255'],
            'venue_address' => ['nullable', 'string', 'max:500'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        if (array_key_exists('name', $data)) {
            $wedding->owner->update(['name' => $data['name']]);
            unset($data['name']);
        }

        if (array_key_exists('paid', $data)) {
            $data['paid_at'] = $data['paid'] ? ($wedding->paid_at ?? now()) : null;
        }

        $wedding->update($data);

        return response()->json([
            'customer' => $this->formatCustomer($wedding->fresh(['owner', 'guests'])),
        ]);
    }

    public function destroy(Wedding $wedding): JsonResponse
    {
        // Deleting the owner cascades to the wedding and its guests.
        $wedding->owner->delete();

        return response()->json(['message' => 'Customer deleted.']);
    }

    public function regeneratePassword(Wedding $wedding, CustomerProvisioner $provisioner): JsonResponse
    {
        $password = $provisioner->regeneratePassword($wedding->owner);

        return response()->json([
            'email' => $wedding->owner->email,
            'password' => $password,
        ]);
    }

    private function formatCustomer(Wedding $wedding): array
    {
        $accepted = $wedding->guests->where('rsvp_status', 'attending')->count();
        $declined = $wedding->guests->where('rsvp_status', 'declined')->count();
        $pending = $wedding->guests->whereNull('rsvp_status')->count();

        return [
            'id' => $wedding->id,
            'title' => $wedding->title,
            'slug' => $wedding->slug,
            'bride_name' => $wedding->bride_name,
            'groom_name' => $wedding->groom_name,
            'event_date' => $wedding->event_date?->toDateString(),
            'venue' => $wedding->venue,
            'venue_address' => $wedding->venue_address,
            'message' => $wedding->message,
            'template_slug' => $wedding->template_slug,
            'locale' => $wedding->locale,
            'status' => $wedding->status,
            'published' => $wedding->status !== 'draft',
            'paid' => (bool) $wedding->paid,
            'paid_at' => $wedding->paid_at?->toDateTimeString(),
            'guest_count' => $wedding->guests->count(),
            'accepted_count' => $accepted,
            'refused_count' => $declined,
            'pending_count' => $pending,
            'credentials' => [
                'name' => $wedding->owner->name,
                'email' => $wedding->owner->email,
                // Passwords are never stored in recoverable form; they are shown
                // once (top-level "password") on create/regenerate only.
                'password' => null,
            ],
            'guests' => $wedding->guests->map(fn ($guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'token' => $guest->token,
                'invite_url' => $guest->token ? '/invite/'.$guest->token : null,
                'rsvp_status' => $guest->rsvp_status,
                'status' => match ($guest->rsvp_status) {
                    'attending' => 'accepted',
                    'declined' => 'refused',
                    default => 'pending',
                },
            ])->values(),
        ];
    }
}
