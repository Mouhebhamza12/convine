<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CustomerProvisioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(Request $request, CustomerProvisioner $provisioner): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'email_local' => ['nullable', 'string', 'max:64', 'regex:/^[a-z0-9._-]+$/i'],
            'template_slug' => ['nullable', 'string', 'max:64'],
        ]);

        $result = $provisioner->create($request->user(), $data);

        return response()->json([
            'customer' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
                'role' => $result['user']->role->value,
            ],
            'wedding' => $this->formatWedding($result['wedding']),
            'password' => $result['password'],
        ], 201);
    }

    private function formatWedding($wedding): array
    {
        return [
            'id' => $wedding->id,
            'title' => $wedding->title,
            'template_slug' => $wedding->template_slug,
            'status' => $wedding->status,
        ];
    }
}
