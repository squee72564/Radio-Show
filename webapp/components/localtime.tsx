'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

type LocalTimeProps = {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

export default function LocalTime({
  date,
  locale,
  options = { hour: '2-digit', minute: '2-digit' },
}: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(date.toLocaleTimeString(locale, options));
  }, [date, locale, options]);

  if (!formatted) {
    return <Skeleton className="w-8 h-5" />;
  }
  
  return <>{formatted}</>;
}
