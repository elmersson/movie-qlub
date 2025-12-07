// components/GenreTagLink.tsx
"use client";

import Link from "next/link";
import React from "react";
import { Chip } from "./ui/chip";
import { TypographyExtraSmall } from "./ui/typography";
import { cn } from "@/lib/utils";

interface TagLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  href: string;
}

const TagLink: React.FC<TagLinkProps> = ({
  name,
  href,
  className,
  ...props
}) => {
  return (
    <Link href={href} passHref>
      <Chip
        className={cn(
          "rounded-full py-1 px-2 hover:bg-neutral-800/80 hover:border-primary-700/30 transition duration-300",
          className
        )}
        {...props}
      >
        <TypographyExtraSmall>{name}</TypographyExtraSmall>
      </Chip>
    </Link>
  );
};

export default TagLink;
