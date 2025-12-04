// components/GenreTagLink.tsx
"use client";

import Link from "next/link";
import React from "react";

interface GenreTagLinkProps {
  genreId: number;
  genreName: string;
}

const GenreTagLink: React.FC<GenreTagLinkProps> = ({ genreId, genreName }) => {
  // Construct the navigation URL based on the required path
  const href = `/protected/movies/genre/${genreId}`;

  return (
    <Link href={href} passHref>
      <span
        key={genreId}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full 
                   cursor-pointer transition duration-150 ease-in-out"
      >
        {genreName}
      </span>
    </Link>
  );
};

export default GenreTagLink;
