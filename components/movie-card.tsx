// components/movie-card.tsx
"use client";

import Link from "next/link";
import React from "react";

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
};

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // The Link component wraps the entire card and points to the dynamic route
  const href = `/protected/movies/${movie.id}`;

  return (
    <Link href={href}>
      <div
        key={movie.id}
        // Add interactive styles to signal that the card is clickable
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden 
                   cursor-pointer transform transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
      >
        {/* Poster Image */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-80 object-cover"
        />

        {/* Details */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 line-clamp-1">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Released: {movie.release_date}
          </p>
          <p className="mt-3 text-sm line-clamp-3">{movie.overview}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
