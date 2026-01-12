export function formatDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return '-';

  // Parse the date string as local date (YYYY-MM-DD)
  const dateStr =
    dateString instanceof Date ? dateString.toISOString() : dateString;
  const parts = dateStr.split('T')[0]?.split('-');

  if (!parts || parts.length !== 3) return '-';

  const [year, month, day] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
