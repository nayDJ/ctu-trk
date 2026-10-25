import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import Pagination from '@/components/Pagination'
import AdminSearch from '@/components/AdminSearch'
import { router } from '@inertiajs/react'
import { useCallback } from 'react'

interface AuditLogsProps {
  auditLogs: { data: Array<{ id: number; user: { name: string } | null; role: string | null; action: string; created_at: string }>; links: any[] }
  filters?: { search?: string }
}

const ROLE_LABELS: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', user: 'User' }

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    timeZone: 'Asia/Makassar',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AuditLogsIndex({ auditLogs, filters }: AuditLogsProps) {
  const handleSearch = useCallback((q: string) => {
    router.get('/admin/audit-logs', { search: q }, { preserveState: true, replace: true })
  }, [])

  return (
    <AdminLayout title="Audit Log">
      <div className="mb-4 max-w-sm"><AdminSearch onFilter={handleSearch} defaultValue={filters?.search ?? ''} placeholder="Cari audit log..." /></div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Audit Log" description={`${auditLogs.data.length} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Aksi</th>
              <th className="text-left px-4 py-3">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.data.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Tidak ada audit log</td></tr>
            ) : auditLogs.data.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="px-4 py-3">{log.user?.name ?? '-'}</td>
                <td className="px-4 py-3">
                  {log.role && <span className="px-2 py-0.5 rounded-full text-xs bg-background text-muted">{ROLE_LABELS[log.role] ?? log.role}</span>}
                </td>
                <td className="px-4 py-3 font-medium">{log.action}</td>
                <td className="px-4 py-3 text-muted">{formatTime(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={auditLogs} links={auditLogs.links} />
          </div>
        </BentoCard>
      </BentoGrid>
    </AdminLayout>
  )
}
