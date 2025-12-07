import { cn } from "@/lib/utils";
import * as React from "react";

type DotProps = React.SVGProps<SVGSVGElement>;

function Dot({ className, ...props }: DotProps) {
  return (
    <svg
      width="3"
      height="3"
      viewBox="0 0 3 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={(cn("flex-grow-0 flex-shrink-0"), className)}
      preserveAspectRatio="none"
      {...props}
    >
      <circle cx="1.5" cy="1.5" r="1.5" fill="#797979" />
    </svg>
  );
}

export { Dot };
