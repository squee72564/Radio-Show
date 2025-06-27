'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

type LocalTimeProps = {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
};

export default function LocalTime({
  date,
  locale,
  options = { hour: '2-digit', minute: '2-digit' },
  className
}: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(date.toLocaleTimeString(locale, options));
  }, [date, locale, options]);

  if (!formatted) {
    return <Skeleton className="inline-block align-middle w-14 h-5" />;
  }
  
  return <span className={className}>{formatted}</span>;
}
