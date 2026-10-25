import AdminLayout from '@/layouts/AdminLayout'
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'
import { useRef } from 'react'

interface ProfileIndexProps {
  settings: Record<string, string>
}

export default function ProfileIndex({ settings }: ProfileIndexProps) {
  const strukturRef = useRef<HTMLInputElement>(null)
  const ppidStrukturRef = useRef<HTMLInputElement>(null)
  const ppidStandarRef = useRef<HTMLInputElement>(null)

  const profil = useForm({
    kecamatan_name: settings.kecamatan_name || '',
    kota_name: settings.kota_name || '',
    provinsi_name: settings.provinsi_name || '',
    alamat: settings.alamat || '',
    telepon: settings.telepon || '',
    email: settings.email || '',
    jam_layanan: settings.jam_layanan || '',
    camat_name: settings.camat_name || '',
    camat_greeting: settings.camat_greeting || '',
    maklumat_pelayanan: settings.maklumat_pelayanan || '',
    visi: settings.visi || '',
    misi: settings.misi || '',
    tupoksi: settings.tupoksi || '',
    struktur_organisasi_image: null as File | null,
    ppid_deskripsi: settings.ppid_deskripsi || '',
    ppid_profil: settings.ppid_profil || '',
    ppid_tugas_wewenang: settings.ppid_tugas_wewenang || '',
    ppid_struktur_image: null as File | null,
    ppid_visi: settings.ppid_visi || '',
    ppid_misi: settings.ppid_misi || '',
    ppid_standar_layanan_judul: settings.ppid_standar_layanan_judul || '',
    ppid_standar_layanan_deskripsi: settings.ppid_standar_layanan_deskripsi || '',
    ppid_standar_layanan_image: null as File | null,
    ppid_pengumuman: settings.ppid_pengumuman || '',
  })

  const pengaturan = useForm({
    marquee_text: settings.marquee_text || '',
    statistik_warga: settings.statistik_warga || '',
    statistik_rt: settings.statistik_rt || '',
    statistik_kk: settings.statistik_kk || '',
  })

  return (
    <AdminLayout title="Profil & Pengaturan">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Profil Kecamatan */}
        <form onSubmit={(e) => { e.preventDefault(); profil.put('/admin/profil', { forceFormData: true, onSuccess: () => toast.success('Profil tersimpan'), onError: () => toast.error('Gagal menyimpan profil') }) }} className="bg-surface rounded-2xl border p-5 space-y-6">
          <h3 className="text-base font-semibold text-muted uppercase tracking-wide">Profil Kecamatan</h3>

          <div>
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Identitas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="profil-kecamatan_name" className="block text-sm font-medium mb-1">Nama Kecamatan</label>
                <input id="profil-kecamatan_name" type="text" value={profil.data.kecamatan_name} onChange={(e) => profil.setData('kecamatan_name', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
              {profil.errors.kecamatan_name && <p className="text-destructive text-sm mt-1">{profil.errors.kecamatan_name}</p>}
              </div>
              <div>
                <label htmlFor="profil-kota_name" className="block text-sm font-medium mb-1">Nama Kota</label>
                <input id="profil-kota_name" type="text" value={profil.data.kota_name} onChange={(e) => profil.setData('kota_name', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
              {profil.errors.kota_name && <p className="text-destructive text-sm mt-1">{profil.errors.kota_name}</p>}
              </div>
              <div>
                <label htmlFor="profil-provinsi_name" className="block text-sm font-medium mb-1">Provinsi</label>
                <input id="profil-provinsi_name" type="text" value={profil.data.provinsi_name} onChange={(e) => profil.setData('provinsi_name', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
              {profil.errors.provinsi_name && <p className="text-destructive text-sm mt-1">{profil.errors.provinsi_name}</p>}
              </div>
              <div>
                <label htmlFor="profil-telepon" className="block text-sm font-medium mb-1">Telepon</label>
                <input id="profil-telepon" type="text" value={profil.data.telepon} onChange={(e) => profil.setData('telepon', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
              {profil.errors.telepon && <p className="text-destructive text-sm mt-1">{profil.errors.telepon}</p>}
              </div>
              <div>
                <label htmlFor="profil-email" className="block text-sm font-medium mb-1">Email</label>
                <input id="profil-email" type="email" value={profil.data.email} onChange={(e) => profil.setData('email', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
              {profil.errors.email && <p className="text-destructive text-sm mt-1">{profil.errors.email}</p>}
              </div>
              <div>
                <label htmlFor="profil-jam_layanan" className="block text-sm font-medium mb-1">Jam Layanan</label>
                <input id="profil-jam_layanan" type="text" value={profil.data.jam_layanan} onChange={(e) => profil.setData('jam_layanan', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Senin - Jumat, 08:00 - 16:00" />
              {profil.errors.jam_layanan && <p className="text-destructive text-sm mt-1">{profil.errors.jam_layanan}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="profil-alamat" className="block text-sm font-medium mb-1">Alamat</label>
              <textarea id="profil-alamat" value={profil.data.alamat} onChange={(e) => profil.setData('alamat', e.target.value)} rows={2} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.alamat && <p className="text-destructive text-sm mt-1">{profil.errors.alamat}</p>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Camat</h4>
            <div>
              <label htmlFor="profil-camat_name" className="block text-sm font-medium mb-1">Nama Camat</label>
              <input id="profil-camat_name" type="text" value={profil.data.camat_name} onChange={(e) => profil.setData('camat_name', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.camat_name && <p className="text-destructive text-sm mt-1">{profil.errors.camat_name}</p>}
            </div>
            <div className="mt-3">
              <label htmlFor="profil-camat_greeting" className="block text-sm font-medium mb-1">Sambutan Camat</label>
              <textarea id="profil-camat_greeting" value={profil.data.camat_greeting} onChange={(e) => profil.setData('camat_greeting', e.target.value)} rows={4} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.camat_greeting && <p className="text-destructive text-sm mt-1">{profil.errors.camat_greeting}</p>}
            </div>
            <div className="mt-3">
              <label htmlFor="profil-maklumat_pelayanan" className="block text-sm font-medium mb-1">Maklumat Pelayanan</label>
              <textarea id="profil-maklumat_pelayanan" value={profil.data.maklumat_pelayanan} onChange={(e) => profil.setData('maklumat_pelayanan', e.target.value)} rows={3} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.maklumat_pelayanan && <p className="text-destructive text-sm mt-1">{profil.errors.maklumat_pelayanan}</p>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Visi & Misi</h4>
            <div>
              <label htmlFor="profil-visi" className="block text-sm font-medium mb-1">Visi</label>
              <textarea id="profil-visi" value={profil.data.visi} onChange={(e) => profil.setData('visi', e.target.value)} rows={3} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.visi && <p className="text-destructive text-sm mt-1">{profil.errors.visi}</p>}
            </div>
            <div className="mt-3">
              <label htmlFor="profil-misi" className="block text-sm font-medium mb-1">Misi</label>
              <textarea id="profil-misi" value={profil.data.misi} onChange={(e) => profil.setData('misi', e.target.value)} rows={5} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
            {profil.errors.misi && <p className="text-destructive text-sm mt-1">{profil.errors.misi}</p>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Tupoksi</h4>
            <textarea id="profil-tupoksi" aria-label="Tupoksi" value={profil.data.tupoksi} onChange={(e) => profil.setData('tupoksi', e.target.value)} rows={5} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          {profil.errors.tupoksi && <p className="text-destructive text-sm mt-1">{profil.errors.tupoksi}</p>}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Struktur Organisasi</h4>
            {settings.struktur_organisasi_image && !profil.data.struktur_organisasi_image && (
              <div className="mb-3">
                <img src={`/storage/${settings.struktur_organisasi_image}`} alt="Struktur Organisasi" className="w-full max-h-64 object-contain rounded-lg border" />
              </div>
            )}
            {/* ponytail: preview object URL per render; cukup untuk file kecil */}
            {profil.data.struktur_organisasi_image && (
              <div className="mb-3">
                <img src={URL.createObjectURL(profil.data.struktur_organisasi_image)} alt="Pratinjau struktur organisasi baru" className="w-full max-h-64 object-contain rounded-lg border" />
              </div>
            )}
            <input ref={strukturRef} type="file" accept="image/*" className="hidden" onChange={(e) => profil.setData('struktur_organisasi_image', e.target.files?.[0] ?? null)} />
            <button type="button" onClick={() => strukturRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-4 text-sm text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
              {profil.data.struktur_organisasi_image ? profil.data.struktur_organisasi_image.name : 'Klik untuk upload gambar struktur organisasi'}
            </button>
            <p className="text-xs text-muted mt-2">JPG/PNG maks 2MB</p>
            {profil.data.struktur_organisasi_image && (
              <button type="button" onClick={() => { profil.setData('struktur_organisasi_image', null); if (strukturRef.current) strukturRef.current.value = '' }} className="mt-2 inline-flex min-h-11 items-center text-sm text-destructive hover:underline">Batalkan file baru</button>
            )}
            {profil.errors.struktur_organisasi_image && <p className="text-destructive text-sm mt-1">{profil.errors.struktur_organisasi_image}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={profil.processing} className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
              {profil.processing ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>

        {/* RIGHT: Pengaturan + Halaman PPID */}
        <div className="flex flex-col gap-6">
          {/* Pengaturan */}
          <form onSubmit={(e) => { e.preventDefault(); pengaturan.put('/admin/settings', { onSuccess: () => toast.success('Pengaturan tersimpan'), onError: () => toast.error('Gagal menyimpan pengaturan') }) }} className="bg-surface rounded-2xl border p-5 space-y-6">
            <h3 className="text-base font-semibold text-muted uppercase tracking-wide">Pengaturan</h3>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Running Text (Marquee)</h4>
              <p className="text-xs text-muted mb-2">Pisahkan item dengan <code className="bg-background px-1 rounded">|</code> (pipe). Contoh: <code className="bg-background px-1 rounded">Selamat datang | Pelayanan 08:00-16:00</code></p>
              <textarea id="pengaturan-marquee_text"
                aria-label="Running Text"
                value={pengaturan.data.marquee_text}
                onChange={(e) => pengaturan.setData('marquee_text', e.target.value)}
                rows={3}
                className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Selamat datang di Portal Kecamatan Tarakan Utara | Pelayanan Senin-Jumat 08:00-16:00 WITA"
              />
            {pengaturan.errors.marquee_text && <p className="text-destructive text-sm mt-1">{pengaturan.errors.marquee_text}</p>}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Statistik</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pengaturan-statistik_warga" className="block text-sm font-medium mb-1">Total Warga</label>
                  <input id="pengaturan-statistik_warga" type="text" value={pengaturan.data.statistik_warga} onChange={(e) => pengaturan.setData('statistik_warga', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="15000" />
                {pengaturan.errors.statistik_warga && <p className="text-destructive text-sm mt-1">{pengaturan.errors.statistik_warga}</p>}
                </div>
                <div>
                  <label htmlFor="pengaturan-statistik_rt" className="block text-sm font-medium mb-1">RT</label>
                  <input id="pengaturan-statistik_rt" type="text" value={pengaturan.data.statistik_rt} onChange={(e) => pengaturan.setData('statistik_rt', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="45" />
                {pengaturan.errors.statistik_rt && <p className="text-destructive text-sm mt-1">{pengaturan.errors.statistik_rt}</p>}
                </div>
                <div>
                  <label htmlFor="pengaturan-statistik_kk" className="block text-sm font-medium mb-1">Kartu Keluarga</label>
                  <input id="pengaturan-statistik_kk" type="text" value={pengaturan.data.statistik_kk} onChange={(e) => pengaturan.setData('statistik_kk', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="5200" />
                {pengaturan.errors.statistik_kk && <p className="text-destructive text-sm mt-1">{pengaturan.errors.statistik_kk}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={pengaturan.processing} className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
                {pengaturan.processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>

          {/* Halaman PPID */}
          <form onSubmit={(e) => { e.preventDefault(); profil.put('/admin/profil', { forceFormData: true, onSuccess: () => toast.success('Pengaturan PPID tersimpan'), onError: () => toast.error('Gagal menyimpan pengaturan PPID') }) }} className="bg-surface rounded-2xl border p-5 flex flex-col flex-1 gap-5">
            <h3 className="text-base font-semibold text-muted uppercase tracking-wide">Halaman PPID</h3>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Deskripsi Hero</h4>
              <textarea id="profil-ppid_deskripsi"
                aria-label="Deskripsi hero PPID"
                value={profil.data.ppid_deskripsi}
                onChange={(e) => profil.setData('ppid_deskripsi', e.target.value)}
                rows={3}
                className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Kecamatan Tarakan Utara menyediakan akses informasi publik..."
              />
            {profil.errors.ppid_deskripsi && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_deskripsi}</p>}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Profil PPID</h4>
              <textarea id="profil-ppid_profil"
                aria-label="Profil PPID"
                value={profil.data.ppid_profil}
                onChange={(e) => profil.setData('ppid_profil', e.target.value)}
                rows={8}
                className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="PPID adalah kepanjangan dari Pejabat Pengelola Informasi dan Dokumentasi..."
              />
            {profil.errors.ppid_profil && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_profil}</p>}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Tugas, Wewenang & SK Penetapan</h4>
              <textarea id="profil-ppid_tugas_wewenang"
                aria-label="Tugas dan wewenang PPID"
                value={profil.data.ppid_tugas_wewenang}
                onChange={(e) => profil.setData('ppid_tugas_wewenang', e.target.value)}
                rows={10}
                className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={"Tugas PPID Utama:\n1. Menyusun dan melaksanakan kebijakan...\n2. Menyusun laporan pelaksanaan kebijakan..."}
              />
            {profil.errors.ppid_tugas_wewenang && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_tugas_wewenang}</p>}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Struktur, Visi & Misi</h4>
              {settings.ppid_struktur_image && !profil.data.ppid_struktur_image && (
                <div className="mb-3">
                  <img src={`/storage/${settings.ppid_struktur_image}`} alt="Struktur Organisasi PPID" className="w-full max-h-64 object-contain rounded-lg border" />
                </div>
              )}
              {/* ponytail: preview object URL per render; cukup untuk file kecil */}
              {profil.data.ppid_struktur_image && (
                <div className="mb-3">
                  <img src={URL.createObjectURL(profil.data.ppid_struktur_image)} alt="Pratinjau struktur PPID baru" className="w-full max-h-64 object-contain rounded-lg border" />
                </div>
              )}
              <input ref={ppidStrukturRef} type="file" accept="image/*" className="hidden" onChange={(e) => profil.setData('ppid_struktur_image', e.target.files?.[0] ?? null)} />
              <button type="button" onClick={() => ppidStrukturRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-4 text-sm text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
                {profil.data.ppid_struktur_image ? profil.data.ppid_struktur_image.name : 'Klik untuk upload gambar struktur organisasi PPID'}
              </button>
              <p className="text-xs text-muted mt-2">JPG/PNG maks 2MB</p>
              {profil.data.ppid_struktur_image && (
                <button type="button" onClick={() => { profil.setData('ppid_struktur_image', null); if (ppidStrukturRef.current) ppidStrukturRef.current.value = '' }} className="mt-2 inline-flex min-h-11 items-center text-sm text-destructive hover:underline">Batalkan file baru</button>
              )}
              {profil.errors.ppid_struktur_image && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_struktur_image}</p>}
              <div className="mt-4">
                <label htmlFor="profil-ppid_visi" className="block text-sm font-medium mb-1">Visi</label>
                <textarea id="profil-ppid_visi"
                  value={profil.data.ppid_visi}
                  onChange={(e) => profil.setData('ppid_visi', e.target.value)}
                  rows={3}
                  className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Terwujudnya pelayanan informasi yang transparan dan akuntabel..."
                />
              {profil.errors.ppid_visi && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_visi}</p>}
              </div>
              <div className="mt-3">
                <label htmlFor="profil-ppid_misi" className="block text-sm font-medium mb-1">Misi</label>
                <textarea id="profil-ppid_misi"
                  value={profil.data.ppid_misi}
                  onChange={(e) => profil.setData('ppid_misi', e.target.value)}
                  rows={5}
                  className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={"1. Meningkatkan pengelolaan dan pelayanan informasi\n2. Membangun dan mengembangkan system penyediaan\n3. Meningkatkan kompetensi sumberdaya manusia"}
                />
              {profil.errors.ppid_misi && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_misi}</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Standar Layanan</h4>
              <div className="mb-3">
                <label htmlFor="profil-ppid_standar_layanan_judul" className="block text-sm font-medium mb-1">Judul</label>
                <input id="profil-ppid_standar_layanan_judul"
                  type="text"
                  value={profil.data.ppid_standar_layanan_judul}
                  onChange={(e) => profil.setData('ppid_standar_layanan_judul', e.target.value)}
                  className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Standar Layanan PPID"
                />
              {profil.errors.ppid_standar_layanan_judul && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_standar_layanan_judul}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="profil-ppid_standar_layanan_deskripsi" className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea id="profil-ppid_standar_layanan_deskripsi"
                  value={profil.data.ppid_standar_layanan_deskripsi}
                  onChange={(e) => profil.setData('ppid_standar_layanan_deskripsi', e.target.value)}
                  rows={4}
                  className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Standar Layanan PPID dapat diakses pada file berikut..."
                />
              {profil.errors.ppid_standar_layanan_deskripsi && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_standar_layanan_deskripsi}</p>}
              </div>
              <label className="block text-sm font-medium mb-1">Gambar Standar Layanan</label>
              {settings.ppid_standar_layanan_image && !profil.data.ppid_standar_layanan_image && (
                <div className="mb-3">
                  <img src={`/storage/${settings.ppid_standar_layanan_image}`} alt="Standar Layanan" className="w-full max-h-64 object-contain rounded-lg border" />
                </div>
              )}
              {/* ponytail: preview object URL per render; cukup untuk file kecil */}
              {profil.data.ppid_standar_layanan_image && (
                <div className="mb-3">
                  <img src={URL.createObjectURL(profil.data.ppid_standar_layanan_image)} alt="Pratinjau standar layanan baru" className="w-full max-h-64 object-contain rounded-lg border" />
                </div>
              )}
              <input ref={ppidStandarRef} type="file" accept="image/*" className="hidden" onChange={(e) => profil.setData('ppid_standar_layanan_image', e.target.files?.[0] ?? null)} />
              <button type="button" onClick={() => ppidStandarRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-4 text-sm text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer">
                {profil.data.ppid_standar_layanan_image ? profil.data.ppid_standar_layanan_image.name : 'Klik untuk upload gambar standar layanan'}
              </button>
              <p className="text-xs text-muted mt-2">JPG/PNG maks 2MB</p>
              {profil.data.ppid_standar_layanan_image && (
                <button type="button" onClick={() => { profil.setData('ppid_standar_layanan_image', null); if (ppidStandarRef.current) ppidStandarRef.current.value = '' }} className="mt-2 inline-flex min-h-11 items-center text-sm text-destructive hover:underline">Batalkan file baru</button>
              )}
              {profil.errors.ppid_standar_layanan_image && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_standar_layanan_image}</p>}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Pengumuman Informasi Publik</h4>
              <textarea id="profil-ppid_pengumuman"
                aria-label="Pengumuman informasi publik"
                value={profil.data.ppid_pengumuman}
                onChange={(e) => profil.setData('ppid_pengumuman', e.target.value)}
                rows={6}
                className="min-h-11 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="PPID dibentuk sebagai wujud Implementasi pasal 20, 21, 28F..."
              />
            {profil.errors.ppid_pengumuman && <p className="text-destructive text-sm mt-1">{profil.errors.ppid_pengumuman}</p>}
            </div>

            <div className="flex-1" />

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={profil.processing} className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
                {profil.processing ? 'Menyimpan...' : 'Simpan Pengaturan PPID'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
