import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface BentoGridProps {
  className?: string;
  children?: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default BentoGrid;
