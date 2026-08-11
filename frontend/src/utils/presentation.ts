import dayjs from 'dayjs'

export function textOf(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['nombre', 'codigo', 'descripcion', 'asunto']) {
      if (record[key] != null) return String(record[key])
    }
  }
  return ''
}

export function formatDate(value: unknown, withTime = false): string {
  if (!value) return ''
  const parsed = dayjs(String(value))
  return parsed.isValid() ? parsed.format(withTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : String(value)
}

export function formatHours(value: unknown): string {
  if (value == null || value === '') return ''
  const n = Number(value)
  return Number.isFinite(n) ? n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : String(value)
}

export function boolLabel(value: unknown, yes = 'Sí', no = 'No'): string {
  return value === true || value === 1 || value === 'true' ? yes : no
}
