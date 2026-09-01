import ExcelJS from 'exceljs'

export interface ExcelColumn<T> {
  header: string
  value: (row: T) => unknown
}

function timestamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function normalizeText(value: string) {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
}

function asExcelDate(value: string): Date | null {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnly) {
    const [, y, m, d] = dateOnly
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  const compact = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (compact) {
    const [, y, m, d] = compact
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  const dateTime = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/)
  if (dateTime) {
    const [, y, m, d, hh, mm, ss = '0'] = dateTime
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss))
  }

  return null
}

function excelValue(value: unknown): ExcelJS.CellValue {
  if (value == null) return ''
  if (value instanceof Date) return value
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const date = asExcelDate(value)
    if (date) return date
    return normalizeText(value)
  }
  return normalizeText(String(value))
}

function isDateValue(value: unknown) {
  return value instanceof Date || (typeof value === 'string' && asExcelDate(value) !== null)
}

function isDateTimeValue(value: unknown) {
  return typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/.test(value)
}

function calculateWidth<T>(rows: T[], column: ExcelColumn<T>) {
  let width = Math.max(12, column.header.length + 3)
  for (const row of rows) {
    const raw = column.value(row)
    const text = raw == null ? '' : String(raw)
    const longestLine = text.split(/\r?\n/).reduce((max, line) => Math.max(max, line.length), 0)
    width = Math.max(width, Math.min(50, longestLine + 2))
  }
  return Math.min(50, width)
}

export async function exportToExcel<T>(prefix: string, rows: T[], columns: ExcelColumn<T>[]) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Tareas'
  workbook.created = new Date()
  workbook.modified = new Date()

  const worksheet = workbook.addWorksheet('Datos', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  worksheet.columns = columns.map(column => ({
    header: column.header,
    key: column.header,
    width: calculateWidth(rows, column),
  }))

  for (const row of rows) {
    const excelRow = worksheet.addRow(columns.map(column => excelValue(column.value(row))))

    columns.forEach((column, index) => {
      const raw = column.value(row)
      const cell = excelRow.getCell(index + 1)
      if (isDateValue(raw)) {
        cell.numFmt = isDateTimeValue(raw) ? 'dd/mm/yyyy hh:mm' : 'dd/mm/yyyy'
      }
      if (typeof raw === 'string' && /[\r\n]/.test(raw)) {
        cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'top' }
      }
    })
  }

  const header = worksheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } }
  header.alignment = { horizontal: 'center', vertical: 'middle' }
  header.height = 20

  if (columns.length > 0) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(1, rows.length + 1), column: columns.length },
    }
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    row.alignment = { vertical: 'top' }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${prefix}_${timestamp()}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
