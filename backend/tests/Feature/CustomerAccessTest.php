<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Wedding;
use App\Services\CustomerProvisioner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
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
            ->assertJsonPath('customer.credentials.email', 'amina.yacine@platform.com')
            ->assertJsonStructure(['password', 'customer' => ['id', 'credentials' => ['email']]]);

        $this->assertDatabaseHas('users', [
            'email' => 'amina.yacine@platform.com',
            'role' => UserRole::Customer->value,
        ]);

        // The one-time password is the real login password (only its hash is
        // stored) — never persisted in recoverable form.
        $customer = User::query()->where('email', 'amina.yacine@platform.com')->firstOrFail();
        $this->assertTrue(Hash::check($response->json('password'), $customer->password));
        $this->assertFalse(Schema::hasColumn('users', 'plain_password'));
    }

    public function test_admin_provisioner_handles_email_collisions(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        app(CustomerProvisioner::class)->create($admin, [
            'name' => 'First Couple',
            'title' => 'First Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $second = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Second Couple',
            'title' => 'Second Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $this->assertSame('amina.yacine2@platform.com', $second['user']->email);
    }

    public function test_admin_customer_list_does_not_leak_passwords(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        // The bulk list exposes identity but NOT the plaintext password, so a
        // single response can never leak every customer's credentials.
        $list = $this->actingAs($admin)->getJson('/api/admin/customers');

        $list
            ->assertOk()
            ->assertJsonCount(1, 'customers')
            ->assertJsonPath('customers.0.credentials.email', 'amina.yacine@platform.com')
            ->assertJsonPath('customers.0.credentials.password', null)
            ->assertJsonPath('summary.customers', 1);

        // The detail view never returns a recoverable password either — it is
        // only ever shown once at creation/regeneration.
        $detail = $this->actingAs($admin)
            ->getJson('/api/admin/customers/'.$provisioned['wedding']->id);

        $detail->assertOk()->assertJsonPath('customer.credentials.password', null);
    }

    public function test_admin_can_regenerate_customer_password(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $original = $provisioned['password'];

        $response = $this->actingAs($admin)
            ->postJson('/api/admin/customers/'.$provisioned['wedding']->id.'/regenerate-password');

        $response->assertOk()->assertJsonStructure(['email', 'password']);
        $this->assertNotSame($original, $response->json('password'));
        // The new one-time password is what now authenticates (hash-only storage).
        $this->assertTrue(Hash::check($response->json('password'), $provisioned['user']->fresh()->password));
    }

    public function test_admin_can_mark_customer_paid_and_publish(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $response = $this->actingAs($admin)
            ->patchJson('/api/admin/customers/'.$provisioned['wedding']->id, [
                'paid' => true,
                'status' => 'ready',
                'template_slug' => 'roseraie',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('customer.paid', true)
            ->assertJsonPath('customer.published', true)
            ->assertJsonPath('customer.template_slug', 'roseraie');

        $this->assertNotNull($provisioned['wedding']->fresh()->paid_at);
    }

    public function test_admin_can_delete_customer(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);

        $this->actingAs($admin)
            ->deleteJson('/api/admin/customers/'.$provisioned['wedding']->id)
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $provisioned['user']->id]);
        $this->assertDatabaseMissing('weddings', ['id' => $provisioned['wedding']->id]);
    }

    public function test_customer_cannot_manage_other_customers(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $provisioned = app(CustomerProvisioner::class)->create($admin, [
            'name' => 'Amina Yacine',
            'title' => 'Amina & Yacine Wedding',
            'email_local' => 'amina.yacine',
        ]);
        $customer = User::factory()->create(['role' => UserRole::Customer]);

        $this->actingAs($customer)
            ->patchJson('/api/admin/customers/'.$provisioned['wedding']->id, ['paid' => true])
            ->assertForbidden();
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
