'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'

interface VillageSlide {
  id: number
  name: string
  leader_name: string | null
  description: string | null
  photo: string | null
}

interface ElegantCarouselProps {
  villages: VillageSlide[]
}

const ACCENT = '#26734D'

export default function ElegantCarousel({ villages }: ElegantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const SLIDE_DURATION = 6000
  const TRANSITION_DURATION = 800
  const total = villages.length

  const goToSlide = useCallback(
    (index: number, dir?: 'next' | 'prev') => {
      if (isTransitioning || index === currentIndex) return
      setDirection(dir || (index > currentIndex ? 'next' : 'prev'))
      setIsTransitioning(true)
      setProgress(0)

      setTimeout(() => {
        setCurrentIndex(index)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, TRANSITION_DURATION / 2)
    },
    [isTransitioning, currentIndex]
  )

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % total, 'next')
  }, [currentIndex, goToSlide, total])

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + total) % total, 'prev')
  }, [currentIndex, goToSlide, total])

  useEffect(() => {
    if (isPaused || total <= 1) return

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 100 / (SLIDE_DURATION / 50)
      })
    }, 50)

    intervalRef.current = setInterval(() => {
      goNext()
    }, SLIDE_DURATION)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentIndex, isPaused, goNext, total])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  if (total === 0) return null

  const current = villages[currentIndex]

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-bg-wash"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${ACCENT}18 0%, transparent 70%)`,
        }}
      />

      <div className="carousel-inner">
        <div className="carousel-content">
          <div className="carousel-content-inner">
            <div className={`carousel-collection-num ${isTransitioning ? 'transitioning' : 'visible'}`}>
              <span className="carousel-num-line" />
              <span className="carousel-num-text">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            <h2 className={`carousel-title ${isTransitioning ? 'transitioning' : 'visible'}`}>
              {current.name}
            </h2>

            <p
              className={`carousel-subtitle ${isTransitioning ? 'transitioning' : 'visible'}`}
              style={{ color: ACCENT }}
            >
              {current.leader_name ? `Lurah: ${current.leader_name}` : 'Kecamatan Tarakan Utara'}
            </p>

            <p className={`carousel-description ${isTransitioning ? 'transitioning' : 'visible'}`}>
              {current.description || 'Informasi lengkap tentang kelurahan ini akan segera tersedia.'}
            </p>

            <div className="carousel-nav-arrows">
              <button onClick={goPrev} className="carousel-arrow-btn" aria-label="Sebelumnya">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goNext} className="carousel-arrow-btn" aria-label="Selanjutnya">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="carousel-image-container">
          <div className={`carousel-image-frame ${isTransitioning ? 'transitioning' : 'visible'}`}>
            {current.photo ? (
              <>
                <img
                  src={`/storage/${current.photo}`}
                  alt={current.name}
                  loading="lazy"
                  className="carousel-image"
                />
                <div
                  className="carousel-image-overlay"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}22 0%, transparent 50%)`,
                  }}
                />
              </>
            ) : (
              <div className="carousel-placeholder">
                Belum ada foto yang di-upload
              </div>
            )}
          </div>

          <div className="carousel-frame-corner carousel-frame-corner--tl" style={{ borderColor: ACCENT }} />
          <div className="carousel-frame-corner carousel-frame-corner--br" style={{ borderColor: ACCENT }} />
        </div>
      </div>

      <div className="carousel-progress-bar">
        {villages.map((village, index) => (
          <button
            key={village.id}
            onClick={() => goToSlide(index)}
            className={`carousel-progress-item ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Ke ${village.name}`}
          >
            <div className="carousel-progress-track">
              <div
                className="carousel-progress-fill"
                style={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                  backgroundColor: index === currentIndex ? ACCENT : undefined,
                }}
              />
            </div>
            <span className="carousel-progress-label">{village.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
