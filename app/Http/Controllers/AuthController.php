<?php

namespace App\Http\Controllers;

use App\Modules\Admin\Support\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use Auditable;

    private const MAX_ATTEMPTS = 5;

    private const LOCKOUT_MINUTES = 5;

    public function showLogin()
    {
        return inertia('Auth/Login');
    }

    public function login(Request $request)
    {
        $session = $request->session();

        // Check lockout
        $lockedUntil = $session->get('login_locked_until');
        if ($lockedUntil && now()->lt($lockedUntil)) {
            $seconds = now()->diffInSeconds($lockedUntil);
            $minutes = (int) ceil($seconds / 60);

            return back()->withErrors([
                'email' => "Terlalu banyak percobaan. Coba lagi dalam {$minutes} menit.",
            ])->onlyInput('email');
        }

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $session->regenerate();
            $session->forget(['login_attempts', 'login_locked_until']);

            $user = Auth::user();
            $this->logAudit('login', 'User', $user->id);

            return match ($user->role) {
                'super_admin', 'admin', 'user' => redirect()->intended(route('admin.dashboard')),
                default => redirect('/'),
            };
        }

        // Track failed attempts
        $attempts = $session->get('login_attempts', 0) + 1;
        $session->put('login_attempts', $attempts);

        if ($attempts >= self::MAX_ATTEMPTS) {
            $session->put('login_locked_until', now()->addMinutes(self::LOCKOUT_MINUTES));
        }

        $remaining = self::MAX_ATTEMPTS - $attempts;
        $message = $remaining > 0
            ? "Email atau password salah. Sisa percobaan: {$remaining}."
            : 'Terlalu banyak percobaan. Akun dikunci sementara.';

        return back()->withErrors(['email' => $message])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $this->logAudit('logout', 'User', auth()->id());

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
