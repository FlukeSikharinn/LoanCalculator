export function useFormat() {
  function formatCurrency(value: number | null, mode?: string) {
    if (value == null) return '—';
    if (mode === 'pdf') {
      return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  }

  return { formatCurrency }
}
