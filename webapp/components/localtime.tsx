'use client';

import { useEffect, useState } from 'react';

type LocalTimeProps = {
  date: Date | string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

export function LocalTime({
  date,
  locale,
  options = { hour: '2-digit', minute: '2-digit' },
}: LocalTimeProps) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = typeof date === 'string' ? new Date(date) : date;
    setFormatted(d.toLocaleTimeString(locale, options));
  }, [date, locale, options]);

  return <>{formatted}</>;
}
