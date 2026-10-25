import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { useForm, usePage } from '@inertiajs/react'
import { KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import type { FormEvent } from 'react'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Kontributor',
}

interface AccountProps {
  auth?: {
    user?: {
      name: string
      email: string
      role: string
    }
  }
}

export default function AccountIndex() {
  const { auth } = usePage().props as AccountProps
  const user = auth?.user
  const form = useForm({ current_password: '', password: '', password_confirmation: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    form.put('/admin/akun/password', {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    })
  }

  const inputClass = (hasError: boolean) =>
    `min-h-11 w-full rounded-lg border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${hasError ? 'border-destructive' : 'border-border'}`

  return (
    <AdminLayout title="Akun">
      <BentoGrid className="max-w-none">
        <BentoCard
          title="Informasi Akun"
          description="Akun yang sedang Anda gunakan"
          icon={<UserCircleIcon className="h-5 w-5 text-muted" />}
          colSpan={2}
        >
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">Nama</dt>
              <dd className="font-medium text-foreground">{user?.name ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium text-foreground break-all">{user?.email ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-muted">Peran</dt>
              <dd className="mt-1">
                <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {ROLE_LABELS[user?.role ?? ''] ?? user?.role ?? '-'}
                </span>
              </dd>
            </div>
          </dl>
        </BentoCard>

        <BentoCard
          title="Ubah Password"
          description="Minimal 8 karakter"
          icon={<KeyIcon className="h-5 w-5 text-muted" />}
          colSpan={2}
        >
          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              name="username"
              autoComplete="username"
              value={user?.email ?? ''}
              readOnly
              hidden
              tabIndex={-1}
            />
            <div>
              <label htmlFor="account-current_password" className="mb-1 block text-sm font-medium text-foreground">
                Password saat ini
              </label>
              <input
                id="account-current_password"
                type="password"
                autoComplete="current-password"
                value={form.data.current_password}
                onChange={(e) => form.setData('current_password', e.target.value)}
                className={inputClass(!!form.errors.current_password)}
                aria-invalid={form.errors.current_password ? true : undefined}
                aria-describedby={form.errors.current_password ? 'account-current-password-error' : undefined}
              />
              {form.errors.current_password && <p id="account-current-password-error" role="alert" className="mt-1 text-sm text-destructive">{form.errors.current_password}</p>}
            </div>

            <div>
              <label htmlFor="account-password" className="mb-1 block text-sm font-medium text-foreground">
                Password baru
              </label>
              <input
                id="account-password"
                type="password"
                autoComplete="new-password"
                value={form.data.password}
                onChange={(e) => form.setData('password', e.target.value)}
                className={inputClass(!!form.errors.password)}
                aria-invalid={form.errors.password ? true : undefined}
                aria-describedby={form.errors.password ? 'account-password-error' : undefined}
              />
              {form.errors.password && <p id="account-password-error" role="alert" className="mt-1 text-sm text-destructive">{form.errors.password}</p>}
            </div>

            <div>
              <label htmlFor="account-password_confirmation" className="mb-1 block text-sm font-medium text-foreground">
                Konfirmasi password baru
              </label>
              <input
                id="account-password_confirmation"
                type="password"
                autoComplete="new-password"
                value={form.data.password_confirmation}
                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                className={inputClass(false)}
              />
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Gunakan password baru saat login berikutnya.</p>
              <button
                type="submit"
                disabled={form.processing}
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:w-auto"
              >
                {form.processing ? 'Menyimpan...' : 'Simpan password'}
              </button>
            </div>
          </form>
        </BentoCard>
      </BentoGrid>
    </AdminLayout>
  )
}
