'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

type LocalDateProps = {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string
};

export default function LocalDate({
  date,
  locale,
  options = { dateStyle: 'medium' },
  className
}: LocalDateProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(date.toLocaleDateString(locale, options));
  }, [date, locale, options]);

  if (!formatted) {
    return <Skeleton className="inline-block align-middle w-22 h-5" />;
  }
  return <span className={className}>{formatted}</span>;
}
