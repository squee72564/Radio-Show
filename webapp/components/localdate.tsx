'use client';

import { useEffect, useState } from 'react';

type LocalDateProps = {
  date: Date | string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

export function LocalDate({
  date,
  locale,
  options = { dateStyle: 'medium' },
}: LocalDateProps) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = typeof date === 'string' ? new Date(date) : date;
    setFormatted(d.toLocaleDateString(locale, options));
  }, [date, locale, options]);

  return <>{formatted}</>;
}
