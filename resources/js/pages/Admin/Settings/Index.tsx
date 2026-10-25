import AdminLayout from '@/layouts/AdminLayout'
import { useForm } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

interface SettingsIndexProps {
  settings: Record<string, string>
}

const SETTING_LABELS: Record<string, string> = {
  alamat: 'Alamat kantor',
  camat_greeting: 'Sambutan camat',
  camat_name: 'Nama camat',
  email: 'Email',
  jam_layanan: 'Jam layanan',
  kecamatan_name: 'Nama kecamatan',
  kota_name: 'Nama kota',
  misi: 'Misi',
  provinsi_name: 'Nama provinsi',
  sidebar_logo_text: 'Teks logo sidebar',
  statistik_kk: 'Jumlah KK',
  statistik_rt: 'Jumlah RT',
  statistik_warga: 'Jumlah warga',
  telepon: 'Telepon',
  tupoksi: 'Tugas dan fungsi',
  visi: 'Visi',
}

const TEXTAREA_KEYS = [
  'marquee_text',
  'camat_greeting',
  'visi',
  'misi',
  'tupoksi',
  'maklumat_pelayanan',
]

function getInputType(key: string): string {
  if (key === 'email') return 'email'
  if (key === 'telepon' || key === 'phone') return 'tel'
  if (key.startsWith('statistik_')) return 'number'
  return 'text'
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
  const { data, setData, put, processing, errors } = useForm(settings)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    put('/admin/settings', {
      onSuccess: () => toast.success('Pengaturan tersimpan'),
      onError: () => toast.error('Gagal menyimpan pengaturan'),
    })
  }

  return (
    <AdminLayout title="Pengaturan">
      <div className="max-w-2xl">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          {Object.entries(data).map(([key, value]) => {
            const error = errors[key]
            const label = SETTING_LABELS[key] ?? key.replace(/_/g, ' ')

            return (
              <div key={key} className="space-y-1.5">
                <label htmlFor={`setting-${key}`} className="block text-sm font-medium text-foreground">
                  {label}
                </label>
                {TEXTAREA_KEYS.includes(key) ? (
                  <textarea
                    id={`setting-${key}`}
                    value={value}
                    onChange={(event) => setData(key, event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `setting-${key}-error` : undefined}
                  />
                ) : (
                  <input
                    id={`setting-${key}`}
                    type={getInputType(key)}
                    value={value}
                    onChange={(event) => setData(key, event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `setting-${key}-error` : undefined}
                  />
                )}
                {error && (
                  <p id={`setting-${key}-error`} role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            )
          })}
          <div className="pt-1">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
