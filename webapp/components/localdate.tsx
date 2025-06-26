'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

type LocalDateProps = {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

export default function LocalDate({
  date,
  locale,
  options = { dateStyle: 'medium' },
}: LocalDateProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(date.toLocaleDateString(locale, options));
  }, [date, locale, options]);

  if (!formatted) {
    return <Skeleton className="w-30 h-5" />;
  }
  return <>{formatted}</>;
}
