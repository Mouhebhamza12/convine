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

    public function test_non_image_upload_is_rejected_and_not_stored(): void
    {
        Storage::fake('public');

        // A PHP web-shell disguised as a wedding photo.
        $malicious = UploadedFile::fake()->create('shell.php', 8, 'application/x-php');

        $this->actingAs($this->owner())
            ->patch('/api/wedding', ['photos' => [$malicious]])
            ->assertStatus(422);

        $this->assertEmpty(Storage::disk('public')->allFiles('weddings/photos'));
    }

    public function test_oversized_image_is_rejected(): void
    {
        Storage::fake('public');

        $tooBig = UploadedFile::fake()->create('huge.jpg', 6000, 'image/jpeg'); // 6 MB > 5 MB cap

        $this->actingAs($this->owner())
            ->patch('/api/wedding', ['photos' => [$tooBig]])
            ->assertStatus(422);

        $this->assertEmpty(Storage::disk('public')->allFiles('weddings/photos'));
    }

    public function test_valid_image_upload_is_accepted(): void
    {
        Storage::fake('public');

        $photo = UploadedFile::fake()->image('photo.jpg', 800, 600);

        $this->actingAs($this->owner())
            ->patch('/api/wedding', ['photos' => [$photo]])
            ->assertOk();

        // Exactly one image was stored, under a safe random name.
        $this->assertCount(1, Storage::disk('public')->allFiles('weddings/photos'));
    }
}
