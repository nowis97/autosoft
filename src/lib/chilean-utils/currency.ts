export function formatCLP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(amount);
}

export function parseCLP(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}
