<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Wedding;
use App\Services\CustomerProvisioner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_see_all_weddings(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $customer = User::factory()->create(['role' => UserRole::Customer]);
        Wedding::query()->create([
            'user_id' => $customer->id,
            'created_by' => $admin->id,
            'title' => 'Test Wedding',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/weddings');

        $response->assertOk()->assertJsonCount(1, 'weddings');
    }

    public function test_customer_can_only_access_own_wedding(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $customer = User::factory()->create(['role' => UserRole::Customer]);
        Wedding::query()->create([
            'user_id' => $customer->id,
            'created_by' => $admin->id,
            'title' => 'Owned Wedding',
        ]);

        $response = $this->actingAs($customer)->getJson('/api/wedding');

        $response->assertOk()->assertJsonPath('wedding.title', 'Owned Wedding');
    }

    public function test_customer_cannot_access_admin_routes(): void
    {
        $customer = User::factory()->create(['role' => UserRole::Customer]);

        $this->actingAs($customer)
            ->getJson('/api/admin/weddings')
            ->assertForbidden();
    }

    public function test_admin_can_provision_customer_with_generated_password(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::Admin,
            'email' => 'you@platform.com',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/customers', [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('customer.email', 'amina.yacine@platform.com')
            ->assertJsonStructure(['password', 'wedding']);

        $this->assertDatabaseHas('users', [
            'email' => 'amina.yacine@platform.com',
            'role' => UserRole::Customer->value,
        ]);
    }

    public function test_customer_can_sync_guest_names(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $response = $this->actingAs($provisioned['user'])->putJson('/api/wedding/guests', [
            'names' => ['Mohamed', 'Fatima', 'Karim', 'Nadia'],
        ]);

        $response
            ->assertOk()
            ->assertJsonCount(4, 'guests');

        $this->assertDatabaseHas('guests', ['name' => 'Mohamed']);
        $this->assertDatabaseHas('guests', ['name' => 'Nadia']);
    }
}
