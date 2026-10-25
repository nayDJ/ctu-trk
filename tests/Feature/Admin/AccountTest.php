<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_roles_can_open_account_page(): void
    {
        foreach (['super_admin', 'admin', 'user'] as $role) {
            $user = User::factory()->create(['role' => $role]);

            $this->actingAs($user)->get('/admin/akun')->assertStatus(200);
        }
    }

    public function test_guest_cannot_open_account_page(): void
    {
        $this->get('/admin/akun')->assertRedirect('/login');
    }

    public function test_user_can_change_own_password(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->put('/admin/akun/password', [
            'current_password' => 'password',
            'password' => 'password-baru-123',
            'password_confirmation' => 'password-baru-123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $user->refresh();

        $this->assertTrue(Hash::check('password-baru-123', $user->password));
        $this->assertFalse(Hash::check('password', $user->password));
    }

    public function test_wrong_current_password_is_rejected(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->put('/admin/akun/password', [
            'current_password' => 'password-salah',
            'password' => 'password-baru-123',
            'password_confirmation' => 'password-baru-123',
        ]);

        $response->assertSessionHasErrors('current_password');

        $this->assertTrue(Hash::check('password', $user->fresh()->password));
    }

    public function test_password_confirmation_must_match(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->put('/admin/akun/password', [
            'current_password' => 'password',
            'password' => 'password-baru-123',
            'password_confirmation' => 'password-beda-123',
        ]);

        $response->assertSessionHasErrors('password');

        $this->assertTrue(Hash::check('password', $user->fresh()->password));
    }

    public function test_new_password_must_be_at_least_eight_characters(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->put('/admin/akun/password', [
            'current_password' => 'password',
            'password' => 'pendek',
            'password_confirmation' => 'pendek',
        ]);

        $response->assertSessionHasErrors('password');

        $this->assertTrue(Hash::check('password', $user->fresh()->password));
    }

    public function test_super_admin_can_change_another_user_password(): void
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($superAdmin)->put("/admin/users/{$target->id}", [
            'password' => 'password-target-123',
        ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('password-target-123', $target->fresh()->password));
    }
}
