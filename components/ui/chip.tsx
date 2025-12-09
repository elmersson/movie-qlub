import { cn } from "@/lib/utils";
import * as React from "react";

interface RatingChipContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Chip({ children, className, ...props }: RatingChipContainerProps) {
  return (
    <div
      className={cn(
        "flex justify-center items-center flex-grow-0 flex-shrink-0 gap-2.5 px-[18px] py-2 rounded-lg bg-white/80 border-neutral-950/10 dark:bg-neutral-800/80 backdrop-blur-sm border-t dark:border-neutral-700/90",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Chip };
