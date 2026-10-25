import PublicLayout from '@/layouts/PublicLayout'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Link } from '@inertiajs/react'
import DOMPurify from 'dompurify'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/date'

interface BeritaShowProps {
  post: { title: string; body: string; body_html: string; image: string | null; published_at: string; author: { name: string } }
}

export default function BeritaShow({ post }: BeritaShowProps) {
  const cleanBody = DOMPurify.sanitize(post.body_html || post.body, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code', 'hr'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'width', 'height', 'target', 'rel'],
  })

  return (
    <PublicLayout title={post.title}>
      <article className="mx-auto max-w-4xl px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Beranda', href: '/' },
            { label: 'Berita', href: '/informasi/berita' },
            { label: post.title },
          ]}
        />

        <Link
          href="/informasi/berita"
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Kembali ke Berita
        </Link>

        <h1 className="max-w-3xl break-words text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-5 text-sm text-muted md:text-base">
          {post.author?.name && (
            <>
              <span className="font-medium text-foreground">{post.author.name}</span>
              <span aria-hidden="true" className="text-muted-foreground">&middot;</span>
            </>
          )}
          <time dateTime={post.published_at}>
            {formatDate(post.published_at, { weekday: 'long' })}
          </time>
        </div>

        {post.image && (
          <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-border bg-primary/5">
            <img
              src={`/storage/${post.image}`}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: cleanBody }} />
      </article>
    </PublicLayout>
  )
}
