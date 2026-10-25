<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Modules\Admin\Support\Auditable;

class UserController extends Controller
{
    use Auditable;

    public function index()
    {
        $users = User::latest()->paginate(15);

        return inertia('Admin/Users/Index', ['users' => $users]);
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([...$validated, 'password' => bcrypt($validated['password'])]);

        $this->logAudit('create', 'User', $user->id);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        if (isset($validated['role']) && $validated['role'] !== $user->role) {
            if ($user->id === auth()->id()) {
                return back()->withErrors(['role' => 'Tidak dapat menurunkan peran akun sendiri.']);
            }
            if ($user->role === 'super_admin' && User::where('role', 'super_admin')->count() <= 1) {
                return back()->withErrors(['role' => 'Tidak dapat menurunkan satu-satunya super admin.']);
            }
        }

        if (! empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        $this->logAudit('update', 'User', $user->id);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'Tidak dapat menghapus akun sendiri.']);
        }

        if ($user->role === 'super_admin' && User::where('role', 'super_admin')->count() <= 1) {
            return back()->withErrors(['user' => 'Tidak dapat menghapus satu-satunya super admin.']);
        }

        if ($user->posts()->exists()) {
            return back()->withErrors(['user' => 'User memiliki berita terkait dan tidak dapat dihapus.']);
        }

        $user->delete();

        $this->logAudit('delete', 'User', $user->id);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus.');
    }
}
