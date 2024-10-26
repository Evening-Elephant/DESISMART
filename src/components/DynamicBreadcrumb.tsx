// components/DynamicBreadcrumb.tsx
"use client"; // Mark this component as a client component

import { usePathname } from 'next/navigation'; // Use next/navigation
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DynamicBreadcrumb: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname
  const pathSegments = pathname.split('/').filter(Boolean); // Split and filter empty segments

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/'); // Create href for each segment
          return (
            <BreadcrumbItem key={href}>
              {index === pathSegments.length - 1 ? (
                <BreadcrumbPage>{segment.replace(/-/g, ' ')}</BreadcrumbPage> // Display the current page
              ) : (
                <BreadcrumbLink href={href}>{segment.replace(/-/g, ' ')}</BreadcrumbLink> // Link to previous segments
              )}
              {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
