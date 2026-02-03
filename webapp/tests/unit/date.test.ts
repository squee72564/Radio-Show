import { formatLocalDateParam, parseLocalDateParam } from '@/lib/date';

describe('formatLocalDateParam', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    const date = new Date(2026, 1, 3);
    expect(formatLocalDateParam(date)).toBe('2026-02-03');
  });
});

describe('parseLocalDateParam', () => {
  it('parses valid YYYY-MM-DD values', () => {
    const parsed = parseLocalDateParam('2026-02-03');
    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(1);
    expect(parsed?.getDate()).toBe(3);
  });

  it('rejects invalid or non-ISO formats', () => {
    expect(parseLocalDateParam('02/03/2026')).toBeNull();
    expect(parseLocalDateParam('2026-2-3')).toBeNull();
    expect(parseLocalDateParam('2026-02-31')).toBeNull();
    expect(parseLocalDateParam('not-a-date')).toBeNull();
  });
});
