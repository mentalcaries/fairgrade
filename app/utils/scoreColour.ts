export function getScoreColour(score: number | null): string {
  if (score === null) return 'text-muted-foreground'
  if (score >= 90) return 'text-accent'
  if (score >= 70) return 'text-chart-3'
  return 'text-destructive'
}