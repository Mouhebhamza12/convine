<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'you@platform.com'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('admin-change-me'),
                'role' => UserRole::Admin,
            ],
        );
    }
}
