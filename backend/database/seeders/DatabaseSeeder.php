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
        // Admin credentials come from the environment so production never ships
        // the well-known dev default. ADMIN_EMAIL / ADMIN_PASSWORD must be set on
        // any real deploy (see .env.example); the fallbacks exist only for local
        // dev convenience.
        $email = config('convive.admin.email');
        $password = config('convive.admin.password');

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make($password),
                'role' => UserRole::Admin,
            ],
        );
    }
}
