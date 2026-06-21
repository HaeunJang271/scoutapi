export function parsePostDate(value: unknown): Date {
  if (value instanceof Date && !isNaN(value.getTime())) return value;

  if (typeof value === 'string' && value.length > 0) {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  if (typeof value === 'number' && value > 0) {
    // Reddit/Devvit may use seconds or milliseconds
    const ms = value < 1e12 ? value * 1000 : value;
    const parsed = new Date(ms);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return new Date();
}

export function formatMonth(date: Date): string {
  if (isNaN(date.getTime())) return 'unknown';
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function fillLast12Months<T extends { month: string }>(
  data: T[],
  valueKey: keyof T,
  defaultValue: number
): T[] {
  const map = new Map(data.map((d) => [d.month, d]));
  const result: T[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const month = formatMonth(d);
    const existing = map.get(month);

    if (existing) {
      result.push(existing);
    } else {
      result.push({ month, [valueKey]: defaultValue } as T);
    }
  }

  return result;
}
