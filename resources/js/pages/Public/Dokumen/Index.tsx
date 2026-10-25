import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { DocumentTextIcon, ArrowDownTrayIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

interface DokumenProps {
  documents: {
    data: Array<{ id: number; title: string; description: string; file_path: string; category: string }>
    links: any[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function DokumenIndex({ documents }: DokumenProps) {
  return (
    <PublicLayout title="Dokumen">
      <PageHeader
        badge="INFORMASI PUBLIK"
        title="Dokumen Publik"
        description="Dokumen resmi yang dapat diakses dan diunduh oleh masyarakat."
        icon={ClipboardDocumentListIcon}
      />

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        {documents.data.length === 0 ? (
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title="Belum ada dokumen"
            description="Dokumen publik akan tersedia di sini setelah dipublikasikan."
          />
        ) : (
          <div className="space-y-3">
            {documents.data.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="break-words font-medium text-foreground">{doc.title}</h2>
                    {doc.description && (
                      <p className="mt-1 break-words text-base leading-relaxed text-muted">{doc.description}</p>
                    )}
                  </div>
                </div>
                <a
                  href={`/storage/${doc.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Unduh ${doc.title}`}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-border px-3 text-sm font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Unduh</span>
                </a>
              </div>
            ))}
          </div>
        )}

        <Pagination data={documents} links={documents.links} />
      </div>
    </PublicLayout>
  )
}
