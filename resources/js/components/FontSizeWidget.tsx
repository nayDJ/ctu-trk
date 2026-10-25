import { useState, useEffect } from 'react'

const SIZES = [
  { key: 'small', label: 'A-', value: '90%', description: 'Perkecil teks' },
  { key: 'normal', label: 'A', value: '100%', description: 'Ukuran teks normal' },
  { key: 'large', label: 'A+', value: '112%', description: 'Perbesar teks' },
] as const

export default function FontSizeWidget() {
  const [active, setActive] = useState<string>('normal')

  useEffect(() => {
    const saved = localStorage.getItem('site_font_size_pref')
    if (saved) {
      setActive(saved)
      const size = SIZES.find(s => s.key === saved)
      if (size) document.documentElement.style.fontSize = size.value
    }
  }, [])

  const set = (key: string) => {
    setActive(key)
    localStorage.setItem('site_font_size_pref', key)
    const size = SIZES.find(s => s.key === key)
    document.documentElement.style.fontSize = size?.value ?? '100%'
  }

  return (
    <div role="group" aria-label="Ukuran teks" className="flex items-center gap-0.5 rounded-full border border-foreground/15 bg-foreground/5 px-2.5 py-1">
      <span className="mr-1.5 hidden text-xs font-semibold text-foreground/60 lg:inline">Teks</span>
      {SIZES.map(size => (
        <button
          key={size.key}
          type="button"
          onClick={() => set(size.key)}
          aria-label={size.description}
          aria-pressed={active === size.key}
          title={`Ukuran Teks ${size.label}`}
          className={`cursor-pointer rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
            active === size.key ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
          }`}
        >
          {size.label}
        </button>
      ))}
    </div>
  )
}
