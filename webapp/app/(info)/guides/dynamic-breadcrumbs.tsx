"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const href = '/' + arr.slice(0, index + 1).join('/');
      const label = decodeURIComponent(segment.replace(/-/g, ' '))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        label,
        href,
      };
    });

  return (
    <Breadcrumb className="pb-10">
      <BreadcrumbList className="flex-1 w-full justify-center items-center text-center">
        {segments.map((segment, index) => (
          <div key={segment.href} className="flex flex-row gap-2 justify-center items-center">
            <BreadcrumbItem >
              <BreadcrumbLink href={segment.href.toLowerCase()} className="text-lg font-bold">
                {segment.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < segments.length - 1 && <BreadcrumbSeparator key={`sep-${segment.href}`} />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}