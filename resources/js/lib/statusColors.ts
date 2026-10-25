// ponytail: single source for complaint/info status labels and colors (recharts needs raw hex)
export const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Diterima',
  VERIFIED: 'Diverifikasi',
  PROCESSING: 'Diproses',
  COMPLETED: 'Selesai',
  REJECTED: 'Ditolak',
}

export const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: '#2E6F9E',
  VERIFIED: '#26734D',
  PROCESSING: '#9A5B00',
  COMPLETED: '#1F6B43',
  REJECTED: '#B43B3B',
}

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  SUBMITTED: 'border-info/25 bg-info-bg text-foreground',
  VERIFIED: 'border-primary/25 bg-primary/10 text-foreground',
  PROCESSING: 'border-processing/25 bg-processing-bg text-foreground',
  COMPLETED: 'border-success/25 bg-success-bg text-foreground',
  REJECTED: 'border-destructive/25 bg-destructive-bg text-destructive',
}

export const STATUS_DOT_CLASSES: Record<string, string> = {
  SUBMITTED: 'bg-info',
  VERIFIED: 'bg-primary',
  PROCESSING: 'bg-processing',
  COMPLETED: 'bg-success',
  REJECTED: 'bg-destructive',
}
