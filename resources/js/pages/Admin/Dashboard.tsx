import AdminLayout from '@/layouts/AdminLayout'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/statusColors'
import { formatDateShort, formatMonthYear } from '@/lib/date'
import { Link, usePage } from '@inertiajs/react'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'

interface RecentMessage {
  id: number
  name: string
  email: string
  subject: string | null
  body: string
  is_read: boolean
  created_at: string
}

interface AgendaItem {
  id: number
  title: string
  starts_at: string
}

interface DashboardProps {
  stats: {
    totalComplaints: number
    complaintsNew: number
    complaintsVerified: number
    complaintsProcessing: number
    complaintsCompleted: number
    complaintsRejected: number
    unreadMessages: number
    totalUsers: number
    statusCounts: Record<string, number>
    monthlyTrend: Record<string, number>
    categoryCounts: Record<string, number>
    recentComplaints: Array<{ id: number; ticket: string; title: string; status: string; category: string; created_at: string }>
    unfollowedComplaints: Array<{ id: number; ticket: string; title: string; category: string; created_at: string }>
  }
  recentMessages: RecentMessage[]
  agendaThisMonth: AgendaItem[]
}


function relativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`
  if (diffDay < 7) return `${diffDay} hari lalu`
  return formatDateShort(date)
}

function initialsOf(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function roleLabelOf(role?: string): string {
  if (!role) return '-'
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function ProfileBody({ name, role, email }: { name: string; role?: string; email?: string }) {
  return (
    <div className="flex flex-col items-center text-center h-full">
      <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
        {initialsOf(name)}
      </div>
      <p className="mt-3 text-base font-semibold text-foreground">{name}</p>
      <span className="mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
        {roleLabelOf(role)}
      </span>
      {email && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted max-w-full">
          <EnvelopeIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{email}</span>
        </p>
      )}
      {role === 'super_admin' && (
        <div className="mt-auto pt-4 grid grid-cols-2 gap-2 w-full">
          <Link href="/admin/profil" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-foreground transition-colors hover:bg-background">
            <UserCircleIcon className="h-4 w-4" aria-hidden="true" /> Profil
          </Link>
          <Link href="/admin/settings" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-foreground transition-colors hover:bg-background">
            <Cog6ToothIcon className="h-4 w-4" aria-hidden="true" /> Pengaturan
          </Link>
        </div>
      )}
    </div>
  )
}

function OfficeBody({ settings }: { settings: Record<string, string> }) {
  const rows = [
    { icon: MapPinIcon, label: 'Alamat', value: settings.alamat },
    { icon: PhoneIcon, label: 'Telepon', value: settings.telepon },
    { icon: EnvelopeIcon, label: 'Email', value: settings.email },
    { icon: ClockIcon, label: 'Jam Layanan', value: settings.jam_layanan },
    {
      icon: UsersIcon,
      label: 'Statistik',
      value: `${Number(settings.statistik_warga || 0).toLocaleString('id-ID')} penduduk · ${settings.statistik_rt || '-'} RT · ${settings.statistik_kk || '-'} KK`,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <row.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted">{row.label}</p>
              <p className="text-base text-foreground break-words">{row.value || '-'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.alamat || 'Kecamatan Tarakan Utara')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-foreground transition-colors hover:bg-background"
        >
          <MapPinIcon className="h-4 w-4" aria-hidden="true" /> Buka di Google Maps
        </a>
      </div>
    </div>
  )
}

function CalendarBody({ agenda }: { agenda: AgendaItem[] }) {
  // ponytail: current month only, add prev/next navigation if needed
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7

  const byDay: Record<number, AgendaItem[]> = {}
  for (const item of agenda) {
    const d = new Date(item.starts_at)
    if (d.getFullYear() === year && d.getMonth() === month) {
      (byDay[d.getDate()] ||= []).push(item)
    }
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sn', 'Sl', 'Rb', 'Kj', 'Jm', 'Sb', 'Mn'].map((d) => (
          <div key={d} className="text-xs font-medium text-muted py-1">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`blank-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayAgenda = byDay[day]
          const isToday = day === today.getDate()
          // ponytail: only agenda days are buttons (fewer tab stops); tooltip shows on hover + focus
          if (!dayAgenda) {
            return (
              <div
                key={day}
                className={`relative aspect-square rounded-lg text-sm flex items-center justify-center ${
                  isToday ? 'bg-primary/10 text-primary font-semibold' : 'text-muted'
                }`}
              >
                {day}
              </div>
            )
          }
          return (
            <button
              key={day}
              type="button"
              aria-label={`Tanggal ${day}: ${dayAgenda.map((a) => a.title).join(', ')}`}
              className="group relative aspect-square rounded-lg text-sm flex items-center justify-center bg-primary text-white font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {day}
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 z-50 mb-1 w-max max-w-[240px] rounded-md bg-primary-dark px-2 py-1 text-left text-xs font-normal text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100">
                {dayAgenda.map((a) => (
                  <span key={a.id} className="block break-words">{a.title}</span>
                ))}
              </span>
            </button>
          )
        })}
      </div>
      {agenda.length > 0 && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {agenda.length} agenda bulan ini
        </div>
      )}
    </>
  )
}

function InboxBody({ messages }: { messages: RecentMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="py-6 text-center">
        <EnvelopeIcon className="w-7 h-7 text-muted mx-auto mb-2" />
        <p className="text-base text-muted">Belum ada pesan masuk</p>
        <p className="text-sm text-muted mt-1">Pesan dari formulir kontak publik akan tampil di sini</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {messages.map((m) => (
        <Link key={m.id} href={`/admin/messages/${m.id}`} className="flex gap-3 p-2.5 rounded-xl hover:bg-background transition-colors">
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
            {initialsOf(m.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className={`text-base truncate ${m.is_read ? 'text-muted' : 'font-semibold text-foreground'}`}>{m.name}</p>
              {!m.is_read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" title="Belum dibaca" />}
              <span className="ml-auto text-xs text-muted shrink-0">{relativeTime(m.created_at)}</span>
            </div>
            <p className="text-sm text-muted truncate">{m.subject || '(tanpa subjek)'}</p>
            <p className="text-sm text-muted truncate">{m.body}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function Dashboard({ stats, recentMessages, agendaThisMonth }: DashboardProps) {
  const pageProps = usePage().props as any
  const userName = pageProps.auth?.user?.name?.split(' ')[0] || 'Admin'
  const fullName: string = pageProps.auth?.user?.name || 'Admin'
  const userRole: string | undefined = pageProps.auth?.user?.role
  const settings = (pageProps.settings ?? {}) as Record<string, string>
  const totalStatus = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0)

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const complaintsThisMonth = stats.monthlyTrend[thisMonthKey] ?? 0
  const unreadMessages = stats.unreadMessages

  const pieData = Object.entries(stats.statusCounts).map(([status, total]) => ({
    name: STATUS_LABELS[status] || status,
    value: total,
    color: STATUS_COLORS[status] || '#587562',
  }))

  const monthlyData = Object.entries(stats.monthlyTrend).map(([month, total]) => ({
    month: month.slice(5),
    total,
  }))

  const categoryData = Object.entries(stats.categoryCounts).map(([name, total]) => ({
    name,
    total,
  }))

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 11) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  })()

  const statCards = [
    {
      label: 'Total Pengaduan',
      value: stats.totalComplaints,
      href: '/admin/complaints',
      icon: DocumentTextIcon,
      alert: false,
      hint: `${complaintsThisMonth} masuk bulan ini`,
    },
    {
      label: 'Belum Ditindaklanjuti',
      value: stats.unfollowedComplaints.length,
      href: '/admin/complaints',
      icon: ExclamationTriangleIcon,
      alert: stats.unfollowedComplaints.length > 0,
      hint: '>1 hari tanpa respon',
    },
    {
      label: 'Pesan Belum Dibaca',
      value: unreadMessages,
      href: '/admin/messages',
      icon: EnvelopeIcon,
      alert: unreadMessages > 0,
      hint: null,
    },
    {
      label: 'Total Pengguna',
      value: stats.totalUsers,
      href: '/admin/users',
      icon: UsersIcon,
      alert: false,
      hint: null,
    },
  ].filter((stat) => stat.href !== '/admin/users' || userRole === 'super_admin')

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 w-full">
        {/* Welcome + Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{greeting}, {userName}</h2>
            <p className="text-base text-muted mt-0.5">Berikut ringkasan aktivitas hari ini.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/complaints" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-base text-white transition-colors hover:bg-primary-dark">
              <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
              Lihat Pengaduan
            </Link>
            <Link href="/admin/statistik" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-base text-foreground transition-colors hover:bg-background">
              Statistik
            </Link>
          </div>
        </div>

        {/* Bento grid */}
        <BentoGrid className="max-w-none">
          {statCards.map((stat) => (
            <BentoCard
              key={stat.label}
              title={stat.label}
              icon={<stat.icon className="h-4 w-4 text-muted" />}
              className={stat.alert ? 'bg-destructive-bg border-destructive/20' : 'bg-primary/10 border-primary/20'}
            >
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                {stat.alert && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-destructive" title="Perlu perhatian" />}
              </div>
              {stat.hint && <p className="text-sm text-muted mt-1">{stat.hint}</p>}
              <Link href={stat.href} className="mt-2 inline-flex min-h-11 items-center text-base text-muted transition-colors hover:text-foreground">
                Lihat detail
              </Link>
            </BentoCard>
          ))}

          {/* Status strip */}
          <BentoCard title="Status Pengaduan" description="Sebaran seluruh tiket tercatat" colSpan={4} className="bg-surface">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { key: 'SUBMITTED', label: 'Baru', color: 'bg-info', value: stats.complaintsNew },
                { key: 'VERIFIED', label: 'Diverifikasi', color: 'bg-warning', value: stats.complaintsVerified },
                { key: 'PROCESSING', label: 'Diproses', color: 'bg-processing', value: stats.complaintsProcessing },
                { key: 'COMPLETED', label: 'Selesai', color: 'bg-success', value: stats.complaintsCompleted },
                { key: 'REJECTED', label: 'Ditolak', color: 'bg-destructive', value: stats.complaintsRejected },
              ].map((status) => (
                <div
                  key={status.key}
                  className="p-3 rounded-lg text-center relative group cursor-default"
                  title={`${STATUS_LABELS[status.key]}: ${status.value}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span className="text-base font-medium text-muted">{status.label}</span>
                  </div>
                  <p className="text-xl font-semibold text-foreground">{status.value}</p>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Profile */}
          <BentoCard title="Profil" description="Akun login Anda">
            <ProfileBody name={fullName} role={userRole} email={pageProps.auth?.user?.email} />
          </BentoCard>

          {/* Kantor */}
          <BentoCard title="Kantor Kecamatan" description={settings.kecamatan_name ?? '-'}>
            <OfficeBody settings={settings} />
          </BentoCard>

          {/* Kalender */}
          <BentoCard title="Kalender" description={formatMonthYear(now)}>
            <CalendarBody agenda={agendaThisMonth} />
          </BentoCard>

          {/* Inbox */}
          <BentoCard
            title="Inbox"
            description={unreadMessages > 0 ? `${unreadMessages} belum dibaca` : 'Pesan masuk terbaru'}
            icon={
              <Link href="/admin/messages" className="inline-flex min-h-11 items-center text-sm text-primary hover:underline">
                Lihat semua
              </Link>
            }
          >
            <InboxBody messages={recentMessages} />
          </BentoCard>

          {/* Aktivitas */}
          <BentoCard
            title="Aktivitas Terbaru"
            description="Pengaduan masuk"
            colSpan={2}
            icon={<Link href="/admin/complaints" className="inline-flex min-h-11 items-center text-sm text-primary hover:underline">Lihat semua</Link>}
          >
            {stats.recentComplaints.length > 0 ? (
              <div className="relative ml-3 border-l-2 border-border space-y-4">
                {stats.recentComplaints.slice(0, 5).map((c, i) => (
                  <Link key={c.id} href={`/admin/complaints/${c.id}`} className="relative pl-6 block group">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors">{c.ticket}</p>
                        <p className="text-sm text-muted truncate">{c.title}</p>
                      </div>
                      <span className="text-xs text-muted shrink-0 whitespace-nowrap">{relativeTime(c.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-base text-muted">Belum ada pengaduan baru</p>
                <p className="text-sm text-muted mt-1">Pengaduan dari warga akan tampil di sini</p>
              </div>
            )}
          </BentoCard>

          {/* Belum ditindaklanjuti */}
          <BentoCard
            title="Belum Ditindaklanjuti"
            description="&gt;1 hari tanpa respon"
            colSpan={2}
            icon={stats.unfollowedComplaints.length > 0
              ? <span className="text-sm bg-destructive-bg text-destructive px-2 py-0.5 rounded-full font-medium">{stats.unfollowedComplaints.length}</span>
              : undefined}
          >
            {stats.unfollowedComplaints.length > 0 ? (
              <div className="space-y-1">
                {stats.unfollowedComplaints.slice(0, 5).map((c) => (
                  <Link key={c.id} href={`/admin/complaints/${c.id}`} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-background text-base group">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{c.ticket}</p>
                      <p className="text-muted text-sm truncate">{c.title}</p>
                    </div>
                    <span className="text-sm text-muted shrink-0 ml-4">{relativeTime(c.created_at)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ExclamationTriangleIcon className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-base text-muted">Semua sudah ditindaklanjuti</p>
                <p className="text-sm text-muted mt-1">Tidak ada pengaduan yang terlewat</p>
              </div>
            )}
          </BentoCard>
        </BentoGrid>

        {/* Charts - full width */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Status Pie Chart */}
          <BentoCard title="Proporsi Status" description="Bulan ini">
            {totalStatus > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" strokeWidth={2} stroke="#fff">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value} pengaduan`, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-base text-muted">Belum ada pengaduan bulan ini</p>
                <p className="text-sm text-muted mt-1">Status tiket baru muncul otomatis di sini</p>
              </div>
            )}
            {totalStatus > 0 && (
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-1.5 text-sm text-muted">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[status] || '#587562' }} />
                    {STATUS_LABELS[status] || status}: {count}
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          {/* Monthly Trend */}
          <BentoCard title="Trend Bulanan" description="12 bulan terakhir">
            {monthlyData.some(d => d.total > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#587562' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#587562' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#26734D" strokeWidth={2} dot={{ r: 3, fill: '#26734D' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-base text-muted">Belum ada data 12 bulan terakhir</p>
                <p className="text-sm text-muted mt-1">Tren terisi saat ada pengaduan masuk</p>
              </div>
            )}
          </BentoCard>

          {/* Category Bar Chart */}
          <BentoCard title="Berdasarkan Kategori" description="Bulan ini">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#587562' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: '#587562' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#26734D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-base text-muted">Belum ada pengaduan bulan ini</p>
                <p className="text-sm text-muted mt-1">Kategori terisi otomatis dari tiket yang masuk</p>
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </AdminLayout>
  )
}
