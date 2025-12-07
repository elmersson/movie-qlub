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
        "flex justify-center items-center flex-grow-0 flex-shrink-0 gap-2.5 px-[18px] py-2 rounded-lg bg-neutral-200/80 border-neutral-700/500 dark:bg-neutral-800/50 backdrop-blur-sm border-t dark:border-neutral-700/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Chip };
