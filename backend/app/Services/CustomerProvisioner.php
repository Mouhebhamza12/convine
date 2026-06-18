<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerProvisioner
{
    /**
     * @return array{user: User, wedding: Wedding, password: string}
     */
    public function create(User $admin, array $data): array
    {
        return DB::transaction(function () use ($admin, $data) {
            $password = Str::password(12);

            $customer = User::query()->create([
                'name' => $data['name'],
                'email' => $this->uniqueEmail($data['email_local'] ?? null),
                'password' => $password,
                'plain_password' => $password,
                'role' => UserRole::Customer,
            ]);

            $wedding = Wedding::query()->create([
                'user_id' => $customer->id,
                'created_by' => $admin->id,
                'title' => $data['title'],
                'slug' => $this->uniqueSlug($data['slug'] ?? $data['title']),
                'bride_name' => $data['bride_name'] ?? null,
                'groom_name' => $data['groom_name'] ?? null,
                'event_date' => $data['event_date'] ?? null,
                'venue' => $data['venue'] ?? null,
                'template_slug' => $data['template_slug'] ?? 'velvet',
                'status' => 'draft',
            ]);

            return [
                'user' => $customer,
                'wedding' => $wedding,
                'password' => $password,
            ];
        });
    }

    /**
     * Generate a fresh password for a customer, store it (hashed + viewable), and return it.
     */
    public function regeneratePassword(User $customer): string
    {
        $password = Str::password(12);

        $customer->update([
            'password' => $password,
            'plain_password' => $password,
        ]);

        return $password;
    }

    /**
     * Build a unique login email from the chosen local part (or an auto-generated
     * one), appending a number on collision: aminayacine -> aminayacine2 -> ...
     */
    private function uniqueEmail(?string $emailLocal): string
    {
        $domain = config('convive.customer_email_domain');

        $base = Str::of($emailLocal ?? 'customer-'.(User::query()->where('role', UserRole::Customer)->count() + 1))
            ->lower()
            ->trim();

        $local = (string) $base;
        $suffix = 1;

        while (User::query()->where('email', $local.'@'.$domain)->exists()) {
            $suffix++;
            $local = $base.$suffix;
        }

        return $local.'@'.$domain;
    }

    /**
     * Build a unique URL slug, appending a number on collision.
     */
    private function uniqueSlug(string $source): string
    {
        $base = Str::slug($source) ?: 'wedding';
        $slug = $base;
        $suffix = 1;

        while (Wedding::query()->where('slug', $slug)->exists()) {
            $suffix++;
            $slug = $base.'-'.$suffix;
        }

        return $slug;
    }
}
