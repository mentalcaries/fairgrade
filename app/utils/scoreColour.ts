export function getScoreColour(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-accent';
  if (score >= 60) return 'text-chart-3';
  return 'text-destructive';
}
