/**
 * CSV Export utility — exports data arrays to downloadable CSV files.
 */

/**
 * Convert an array of objects to CSV string.
 */
function toCSV<T extends Record<string, unknown>>(data: T[], columns: { key: string; label: string }[]): string {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key]
      if (val === null || val === undefined) return ''
      const str = String(val)
      // Escape quotes and wrap in quotes if contains comma or quote
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  )
  return [header, ...rows].join('\n')
}

/**
 * Download data as a CSV file.
 */
export function downloadCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const csv = toCSV(data, columns)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
