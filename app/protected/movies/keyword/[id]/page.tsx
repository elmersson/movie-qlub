"use client";

import React from "react";
import { useMoviesByKeyword } from "@/lib/queries";
import { Loader2, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

interface KeywordMoviesPageProps {
  params: {
    id: string; // Corresponds to the keywordId
  };
}

// NOTE: You might need another hook here to fetch the keyword NAME if you want it in the title
// For simplicity, we assume we know the ID and the API returns the results.

export default function KeywordMoviesPage({ params }: KeywordMoviesPageProps) {
  const resolvedParams = (React.use as any)(params) as { id: string };
  const keywordId = resolvedParams.id;
  // Fetch movies associated with the keyword ID
  const {
    data: moviesResponse,
    isLoading,
    error,
  } = useMoviesByKeyword(keywordId);

  const movies = moviesResponse?.results || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Keyword
        Movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500 text-xl">
        Error fetching movies: {(error as Error).message}
      </div>
    );
  }

  // If the API returns a success: false or no results for a valid ID
  if (!moviesResponse || moviesResponse.total_results === 0) {
    // You might want to fetch the keyword details first to check if the ID is truly valid
    // but for now, we treat no results as a soft 404.
    return (
      <div className="flex justify-center items-center h-96 text-gray-500 text-xl">
        No movies found for this keyword ID ({keywordId}).
      </div>
    );
  }

  // Optional: Extract the keyword name from the first movie's keywords list
  // or fetch it using the keyword details endpoint if needed for display.
  const keywordName = `Keyword ID: ${keywordId}`;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-10 px-4">
      <h1 className="flex items-center gap-3 text-4xl font-extrabold mb-8">
        <Tag className="w-8 h-8 text-blue-500" /> Movies Tagged with "
        {keywordName}"
      </h1>

      {/* --- MOVIE LIST GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map(
          (
            movie: any // Using 'any' as Movie type is not provided here
          ) => (
            <Link
              key={movie.id}
              href={`/protected/movies/${movie.id}`}
              className="group block relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="aspect-[2/3] w-full relative">
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    No Poster
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold truncate group-hover:text-blue-500 transition duration-150">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "TBD"}
                </p>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
