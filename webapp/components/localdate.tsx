'use client';

import { useEffect, useState } from 'react';

type LocalDateProps = {
  date: Date;
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
    setFormatted(date.toLocaleDateString(locale, options));
  }, [date, locale, options]);

  return <>{formatted}</>;
}
