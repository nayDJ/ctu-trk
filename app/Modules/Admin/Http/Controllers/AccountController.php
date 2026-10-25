<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    use Auditable;

    public function index()
    {
        return inertia('Admin/Account/Index');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // cast 'hashed' pada model User yang melakukan hashing
        $request->user()->update(['password' => $validated['password']]);

        $this->logAudit('update', 'User', $request->user()->id);

        return back()->with('success', 'Password berhasil diubah.');
    }
}
