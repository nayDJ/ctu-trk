import type { ReactNode } from 'react'

// ponytail: gaya tabel Posts dipakai ulang semua index admin; zebra via CSS tanpa plumbing index.
export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <table className="w-full min-w-[640px] text-sm [&_tbody_tr:nth-child(even)]:bg-background/60">
      {children}
    </table>
  )
}

export function AdminTh({ children, right = false }: { children: ReactNode; right?: boolean }) {
  return (
    <th className={`${right ? 'text-right' : 'text-left'} px-4 py-3 text-xs font-semibold text-muted`}>
      {children}
    </th>
  )
}

export function AdminTr({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-primary/5">
      {children}
    </tr>
  )
}

export function AdminEmpty({ colSpan, children = 'Tidak ada data' }: { colSpan: number; children?: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-muted">
        {children}
      </td>
    </tr>
  )
}
