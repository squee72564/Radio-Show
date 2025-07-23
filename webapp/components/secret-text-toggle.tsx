"use client"

import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SecretTextToggle({
  className,
  secret
}: {
  className?: string,
  secret: string
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div className={cn("flex flex-row gap-2 w-full items-center", className)}>
      <span>Password: </span>
      <span>{isVisible ? secret : '•'.repeat(secret.length)}</span>
      <Button onClick={() => setIsVisible(!isVisible)} className='w-4 h-4' variant={"outline"}>
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}