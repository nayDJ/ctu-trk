import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { Link } from '@inertiajs/react'
import { NewspaperIcon } from '@heroicons/react/24/outline'
import { formatDateShort } from '@/lib/date'

interface BeritaProps {
  posts: {
    data: Array<{ id: number; title: string; slug: string; excerpt: string; published_at: string; image: string | null }>
    links: any[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function BeritaIndex({ posts }: BeritaProps) {
  return (
    <PublicLayout title="Berita">
      <PageHeader
        badge="INFORMASI PUBLIK"
        title="Berita Terkini"
        description="Kabar dan kegiatan terbaru dari Kecamatan Tarakan Utara."
        icon={NewspaperIcon}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {posts.data.length === 0 ? (
          <EmptyState
            icon={NewspaperIcon}
            title="Belum ada berita"
            description="Berita terbaru akan muncul di sini setelah dipublikasikan."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post) => (
              <Link
                key={post.id}
                href={`/informasi/berita/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {post.image ? (
                  <div className="aspect-video overflow-hidden bg-primary/5">
                    <img
                      src={`/storage/${post.image}`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-primary/5">
                    <NewspaperIcon className="h-10 w-10 text-primary/30" aria-hidden="true" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">{post.excerpt}</p>
                  <p className="mt-auto pt-4 text-sm text-muted">{formatDateShort(post.published_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination data={posts} links={posts.links} />
      </div>
    </PublicLayout>
  )
}
