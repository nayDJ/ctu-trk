import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import { SparksCarousel, type SparkItem } from '@/components/ui/sparks-carousel'
import { NewspaperIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/date'

interface Post {
  id: number
  title: string
  slug: string
  image: string | null
  published_at: string
}

interface Agenda {
  id: number
  title: string
  starts_at: string
  location: string | null
  image_path: string | null
}

interface Gallery {
  id: number
  title: string
  caption: string | null
  credit: string | null
  path: string | null
}

interface InformationProps {
  posts: Post[]
  upcomingAgendas: Agenda[]
  pastAgendas: Agenda[]
  galleries: Gallery[]
}

const toAgendaItem = (agenda: Agenda): SparkItem => ({
  id: agenda.id,
  imageSrc: agenda.image_path ? `/storage/${agenda.image_path}` : null,
  title: agenda.title,
  meta: `${formatDate(agenda.starts_at, { weekday: 'long' })}${agenda.location ? ` di ${agenda.location}` : ''}`,
  href: `/informasi/agenda/${agenda.id}`,
})

export default function Information({ posts, upcomingAgendas, pastAgendas, galleries }: InformationProps) {
  const beritaItems: SparkItem[] = posts.map((post) => ({
    id: post.id,
    imageSrc: post.image ? `/storage/${post.image}` : null,
    title: post.title,
    meta: formatDate(post.published_at, { weekday: 'long' }),
    href: `/informasi/berita/${post.slug}`,
  }))

  const upcomingAgendaItems: SparkItem[] = upcomingAgendas.map(toAgendaItem)
  const pastAgendaItems: SparkItem[] = pastAgendas.map(toAgendaItem)

  const galeriItems: SparkItem[] = galleries.map((gallery) => ({
    id: gallery.id,
    imageSrc: gallery.path ? `/storage/${gallery.path}` : null,
    title: gallery.title,
    meta: gallery.credit ? `Foto: ${gallery.credit}` : undefined,
  }))

  return (
    <PublicLayout title="Informasi">
      <PageHeader
        badge="INFORMASI"
        title="Informasi Publik"
        description="Berita, agenda, dan galeri kegiatan Kecamatan Tarakan Utara."
        icon={NewspaperIcon}
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SparksCarousel
            title="Berita Terkini"
            viewAllHref="/informasi/berita"
            items={beritaItems}
            emptyMessage="Belum ada berita yang dipublikasikan."
          />

          <SparksCarousel
            title="Agenda Mendatang"
            viewAllHref="/informasi/agenda"
            items={upcomingAgendaItems}
            emptyMessage="Belum ada agenda mendatang."
          />

          {pastAgendaItems.length > 0 && (
            <SparksCarousel
              title="Agenda Sebelumnya"
              viewAllHref="/informasi/agenda"
              items={pastAgendaItems}
            />
          )}

          <SparksCarousel
            title="Galeri Kegiatan"
            viewAllHref="/informasi/galeri"
            items={galeriItems}
            emptyMessage="Belum ada foto kegiatan."
          />
        </div>
      </div>
    </PublicLayout>
  )
}
