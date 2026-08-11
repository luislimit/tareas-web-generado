import { Chip } from '@mui/material'

interface Props { label?: string | null; color?: string | null; size?: 'small' | 'medium' }

function fallbackColor(label: string) {
  const value = label.trim().toLowerCase()
  if (value.includes('final') || value.includes('aprob')) return '#15803d'
  if (value.includes('curso') || value.includes('factur')) return '#2563eb'
  if (value.includes('pend')) return '#d97706'
  if (value.includes('reten')) return '#7c3aed'
  if (value.includes('cancel') || value.includes('inactiv')) return '#64748b'
  if (value.includes('rechaz')) return '#dc2626'
  if (value.includes('no fact')) return '#475569'
  return '#0f766e'
}

function readableText(background: string) {
  const hex = background.trim()
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) return '#ffffff'
  const n = Number.parseInt(match[1], 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > .62 ? '#111827' : '#ffffff'
}

export function StateChip({ label, color, size = 'small' }: Props) {
  const text = label?.trim() || '—'
  const bg = color?.trim() || fallbackColor(text)
  return <Chip size={size} label={text} sx={{ bgcolor: bg, color: readableText(bg), fontWeight: 700, minWidth: 78 }} />
}
