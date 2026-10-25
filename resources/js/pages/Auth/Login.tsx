import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Clock, Eye, EyeOff, Loader2, Lock, MapPin, Phone, User } from 'lucide-react';
import { PARANG_LIGHT } from '@/lib/batik';

export default function Login() {
    const { settings } = usePage().props as { settings?: Record<string, string> };
    const kecamatanName = settings?.kecamatan_name || 'Kecamatan Tarakan Utara';
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const batik = PARANG_LIGHT;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/login');
    };

    const floatingLabelClass =
        'absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-[#2A835F] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6';

    return (
        <>
            <Head title="Login" />
            <section className="relative w-full min-h-dvh bg-[#092328] overflow-hidden">
                <div aria-hidden className="absolute inset-0">
                    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#12544F] opacity-40 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#2A835F] opacity-30 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: batik }} />
                </div>

                <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                        <span className="text-xs tracking-[0.14em] uppercase text-white/60">Admin</span>
                    </div>
                </header>

                <div className="relative z-10 min-h-dvh w-full grid place-items-center px-4 py-20">
                    <div className="w-full max-w-3xl">
                        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl card-animate bg-white">
                            <div className="relative bg-gradient-to-br from-[#12544F] to-[#2A835F] text-white p-8 flex flex-col justify-center overflow-hidden">
                                <div aria-hidden className="absolute inset-0">
                                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white opacity-10" />
                                    <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white opacity-10" />
                                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: batik }} />
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="shimmer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <img src="/images/logo.png" alt="Logo" className="mb-4 h-16 w-auto" />
                                    <p className="text-xs tracking-[0.14em] uppercase text-white/70">{kecamatanName}</p>
                                    <h2 className="mt-1 text-2xl font-bold">Panel Administrasi</h2>
                                    <div className="mt-6 space-y-3 text-sm text-white/80 max-md:hidden">
                                        {settings?.alamat && (
                                            <p className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                                {' '}
                                                {settings.alamat}
                                            </p>
                                        )}
                                        {settings?.telepon && (
                                            <p className="flex items-start gap-2">
                                                <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                                {' '}
                                                {settings.telepon}
                                            </p>
                                        )}
                                        {settings?.jam_layanan && (
                                            <p className="flex items-start gap-2">
                                                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                                {' '}
                                                {settings.jam_layanan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
                                    <p className="mt-1 text-sm text-gray-500">Masuk ke panel administrasi</p>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    <div className="relative z-0">
                                        <input
                                            type="email"
                                            id="floating_email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                            placeholder=" "
                                            required
                                            autoFocus
                                            autoComplete="username"
                                            aria-invalid={errors.email ? true : undefined}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                        />
                                        <label htmlFor="floating_email" className={floatingLabelClass}>
                                            <User className="inline-block mr-2 -mt-1" size={16} aria-hidden="true" />
                                            Email
                                        </label>
                                        {errors.email && (
                                            <p id="email-error" role="alert" className="text-red-600 text-xs mt-2">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="relative z-0">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="floating_password"
                                            value={data.password}
                                            onChange={(event) => setData('password', event.target.value)}
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer pr-10"
                                            placeholder=" "
                                            required
                                            autoComplete="current-password"
                                            aria-invalid={errors.password ? true : undefined}
                                            aria-describedby={errors.password ? 'password-error' : undefined}
                                        />
                                        <label htmlFor="floating_password" className={floatingLabelClass}>
                                            <Lock className="inline-block mr-2 -mt-1" size={16} aria-hidden="true" />
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors"
                                            onClick={() => setShowPassword((visible) => !visible)}
                                        >
                                            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                        </button>
                                        {errors.password && (
                                            <p id="password-error" role="alert" className="text-red-600 text-xs mt-2">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={data.remember}
                                            onChange={(event) => setData('remember', event.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#2A835F] focus:ring-[#2A835F] focus:ring-offset-0"
                                        />
                                        <label htmlFor="remember" className="text-sm text-gray-600 select-none">Ingat saya</label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group w-full flex items-center justify-center py-3 px-4 bg-[#2A835F] hover:bg-[#12544F] rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A835F] transition-all duration-300 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                        ) : (
                                            <>
                                                Masuk
                                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center text-xs text-gray-500 space-y-1">
                                    <p>
                                        Kendala masuk? Hubungi kantor kecamatan
                                        {settings?.telepon ? ` — ${settings.telepon}` : ''}
                                    </p>
                                    <a href="/" className="inline-block text-[#2A835F] hover:text-[#12544F] transition-colors">
                                        ← Kembali ke beranda
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-xs text-white/30">
                            &copy; {new Date().getFullYear()} {kecamatanName}
                        </p>
                    </div>
                </div>

                <style>{`
                    .card-animate {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
                    }
                    @keyframes fadeUp {
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .shimmer {
                        animation: shine 4.5s ease-in-out infinite;
                    }
                    @keyframes shine {
                        0% { transform: translateX(-160%) skewX(-12deg); }
                        55%, 100% { transform: translateX(450%) skewX(-12deg); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .card-animate { animation: none; opacity: 1; transform: none; }
                        .shimmer { animation: none; display: none; }
                    }
                `}</style>
            </section>
        </>
    );
}
