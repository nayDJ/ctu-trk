import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface AdminSearchProps {
  onFilter: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export default function AdminSearch({ onFilter, placeholder = 'Cari...', defaultValue = '' }: AdminSearchProps) {
  const [query, setQuery] = useState(defaultValue)
  const appliedRef = useRef(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // ponytail: ikuti filter dari URL (back/forward) tanpa menimpa ketikan yang sedang berjalan
  useEffect(() => {
    if (defaultValue !== appliedRef.current) {
      appliedRef.current = defaultValue
      setQuery(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // jangan kirim request saat mount atau saat nilai tidak berubah
      if (query === appliedRef.current) return

      appliedRef.current = query
      onFilter(query)
    }, 200)
    return () => clearTimeout(timerRef.current)
  }, [query, onFilter])

  return (
    <div className="relative">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-11 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Bersihkan pencarian"
          className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
