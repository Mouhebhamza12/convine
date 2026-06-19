<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use App\Services\CustomerProvisioner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WeddingPhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    private function owner(): User
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        return app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ])['user'];
    }

    private function photos(User $owner): array
    {
        return $owner->wedding()->first()->photos ?? [];
    }

    public function test_non_image_upload_is_rejected_and_not_stored(): void
    {
        Storage::fake('public');
        $owner = $this->owner();

        // A PHP web-shell disguised as a wedding photo.
        $malicious = UploadedFile::fake()->create('shell.php', 8, 'application/x-php');

        $this->actingAs($owner)
            ->patch('/api/wedding', ['photos' => [$malicious]])
            ->assertStatus(422);

        $this->assertEmpty($this->photos($owner));
    }

    public function test_oversized_image_is_rejected(): void
    {
        Storage::fake('public');
        $owner = $this->owner();

        $tooBig = UploadedFile::fake()->create('huge.jpg', 6000, 'image/jpeg'); // 6 MB > 5 MB cap

        $this->actingAs($owner)
            ->patch('/api/wedding', ['photos' => [$tooBig]])
            ->assertStatus(422);

        $this->assertEmpty($this->photos($owner));
    }

    public function test_valid_image_upload_is_accepted(): void
    {
        Storage::fake('public');
        $owner = $this->owner();

        $photo = UploadedFile::fake()->image('photo.jpg', 800, 600);

        $response = $this->actingAs($owner)
            ->patch('/api/wedding', ['photos' => [$photo]]);

        $response->assertOk();
        // Exactly one photo persisted (asserted via the API/DB, not disk counts,
        // so a stale fake-disk file can never make this flaky).
        $this->assertCount(1, $response->json('wedding.photos'));
        $this->assertCount(1, $this->photos($owner));
    }
}
