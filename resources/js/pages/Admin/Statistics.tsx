import AdminLayout from '@/layouts/AdminLayout'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/statusColors'
import { router } from '@inertiajs/react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import StatusPill from '@/components/admin/StatusPill'

interface StatisticsProps {
  stats: {
    totalComplaints: number
    statusCounts: Record<string, number>
    trend: Record<string, number>
    trendLabel: string
    categoryCounts: Record<string, number>
    totalInfoRequests: number
    infoStatusCounts: Record<string, number>
    recentComplaints: Array<{ id: number; ticket: string; title: string; status: string; category: string; created_at: string }>
    unfollowedComplaints: Array<{ id: number; ticket: string; title: string; category: string; created_at: string }>
    period: string
  }
}


const PERIODS = [
  { key: 'harian', label: 'Harian' },
  { key: 'mingguan', label: 'Mingguan' },
  { key: 'bulanan', label: 'Bulanan' },
  { key: 'tahunan', label: 'Tahunan' },
]

export default function Statistics({ stats }: StatisticsProps) {
  const pieData = Object.entries(stats.statusCounts).map(([status, total]) => ({
    name: STATUS_LABELS[status] || status,
    value: total,
    color: STATUS_COLORS[status] || '#587562',
  }))

  const trendData = Object.entries(stats.trend).map(([key, total]) => ({
    key: key.length > 5 ? key.slice(5) : key,
    total,
  }))

  const categoryData = Object.entries(stats.categoryCounts).map(([name, total]) => ({
    name,
    total,
  }))

  const handlePeriodChange = (period: string) => {
    router.get('/admin/statistik', { period }, { preserveState: true, replace: true })
  }

  return (
    <AdminLayout title="Statistik">
      <div className="space-y-6">
        {/* Period Tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePeriodChange(p.key)}
                aria-pressed={stats.period === p.key}
                className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors sm:px-4 ${
                  stats.period === p.key
                    ? 'bg-primary text-white'
                    : 'border border-border bg-surface text-muted hover:bg-background'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <a
            href={`/admin/statistik/export?period=${stats.period}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-muted transition-colors hover:bg-background sm:w-auto"
          >
            <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
            Unduh Laporan PDF
          </a>
        </div>

        <BentoGrid className="max-w-none">
          {/* Summary Cards */}
          <BentoCard title="Total Pengaduan" description="Sepanjang waktu">
            <p className="text-3xl font-bold">{stats.totalComplaints}</p>
          </BentoCard>
          <BentoCard title="Permohonan Info" description="Permohonan informasi">
            <p className="text-3xl font-bold">{stats.totalInfoRequests}</p>
          </BentoCard>
          <BentoCard title="Belum Ditindaklanjuti" description="Perlu tindak lanjut">
            <p className="text-3xl font-bold text-destructive">{stats.unfollowedComplaints.length}</p>
          </BentoCard>
          <BentoCard title="Selesai" description="Sudah ditangani">
            <p className="text-3xl font-bold text-primary">{stats.statusCounts.COMPLETED || 0}</p>
          </BentoCard>

          {/* Pie Chart - Status */}
          <BentoCard title="Proporsi Status" description="Sebaran status" colSpan={2}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" strokeWidth={2} stroke="#fff">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value} pengaduan`, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-base text-muted">Belum ada data</p>
            )}
            {pieData.length > 0 && (
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

          {/* Trend Chart */}
          <BentoCard title={`Tren ${stats.trendLabel}`} description="Pengaduan per periode" colSpan={2}>
            {trendData.some(d => d.total > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <XAxis dataKey="key" tick={{ fontSize: 11, fill: '#587562' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#587562' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#26734D" strokeWidth={2} dot={{ r: 3, fill: '#26734D' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-base text-muted">Belum ada data</p>
            )}
          </BentoCard>

          {/* Category Bar */}
          <BentoCard title="Berdasarkan Kategori" description="Jumlah per kategori" colSpan={2}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#587562' }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fill: '#587562' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#26734D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-base text-muted">Belum ada data</p>
            )}
          </BentoCard>

          <BentoCard title="Pengaduan Terbaru" description="7 pengaduan terakhir" colSpan={2}>
            {stats.recentComplaints.length > 0 ? (
              <div className="space-y-2">
                {stats.recentComplaints.slice(0, 7).map((c) => (
                  <a key={c.id} href={`/admin/complaints/${c.id}`} className="flex items-center justify-between gap-3 rounded-lg p-2 text-base hover:bg-background">
                    <div className="min-w-0">
                      <p className="font-medium">{c.ticket}</p>
                      <p className="max-w-[200px] truncate text-sm text-muted">{c.title}</p>
                    </div>
                    <StatusPill status={c.status} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-base text-muted">Belum ada pengaduan</p>
            )}
          </BentoCard>
        </BentoGrid>
      </div>
    </AdminLayout>
  )
}
