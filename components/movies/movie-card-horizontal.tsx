// components/MovieCard.tsx
import { format } from "date-fns";

import React from "react";
import { Star, Info } from "lucide-react";
import { TmdbMovieDetailsWithAppendices } from "@/types/tmdb";
import { Dot } from "../ui/dot";
import { cn } from "@/lib/utils";
import Image from "next/image";
import TagLink from "../genre-tag-link";

// --- Props Definition (Updated: rank is now optional) ---
interface MovieCardProps {
  movie: TmdbMovieDetailsWithAppendices;
  rank?: number; // <--- RANK IS NOW OPTIONAL
  imageBaseUrl: string; // Base URL for TMDb images (e.g., 'https://image.tmdb.org/t/p')
}

// --- Main Component ---

const MovieCardHorizontal: React.FC<MovieCardProps> = ({
  movie,
  rank,
  imageBaseUrl,
}) => {
  // --- Data Transformation Functions (same as before) ---
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(0) + "K";
    }
    return count.toString();
  };

  const releaseYear = movie.release_date
    ? format(new Date(movie.release_date), "yyyy")
    : "N/A";

  const formatRuntime = (runtime: number | null): string => {
    if (!runtime || runtime === 0) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    const h = hours > 0 ? `${hours}h ` : "";
    const m = minutes > 0 || hours === 0 ? `${minutes}m` : "";

    return `${h}${m}`.trim();
  };

  const getCertification = (): string => {
    const usRelease = movie.release_dates?.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    const certification = usRelease?.release_dates.find(
      (d) => d.type === 3
    )?.certification;

    return certification || "N/A";
  };

  // --- Derived Data ---
  const formattedRating = movie.vote_average.toFixed(1);
  const formattedVoteCount = formatCount(movie.vote_count);
  const posterUrl = `${imageBaseUrl}${movie.poster_path}`;

  // --- Component JSX ---
  return (
    <div className="flex justify-start items-start gap-[19px] p-5 rounded-[10px] bg-neutral-400/5">
      {/* --- Conditional Rank Display --- */}
      {rank !== undefined && (
        <div className="flex justify-start items-center flex-shrink-0 gap-2.5">
          <p className="flex-shrink-0 text-[28px] text-left text-text-primary">
            {rank}
          </p>
          <div className="flex-shrink-0 w-1 h-10 rounded-2xl bg-[#29BE88]"></div>
        </div>
      )}

      {/* Image and Bookmark Icon */}
      <div className="flex-shrink-0 relative">
        <Image
          src={posterUrl}
          alt={`${movie.title} Poster`}
          width={126}
          height={194}
          className="flex-shrink-0 w-[126px] h-[194px] rounded-[5px] object-cover"
        />
        {/* <BookmarkIconWithPlus /> */}
        <button
          aria-label="Add to Watchlist"
          className={cn(
            "absolute left-4 top-0 w-[39px] h-[50.5px] hover:opacity-80 transition disabled:hidden",
            rank && "left-9"
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          disabled={false}
        >
          <svg width="42" height="53" viewBox="0 0 42 53" fill="none">
            <path
              d="M1.5 50.5V0H21H40.5V50.5L22 43.5L1.5 50.5Z"
              fill="#1A1A1A"
              fillOpacity="0.7"
            />
            <path
              d="M0.5 1.19209e-07V52L22.0513 44.5149L41.5 52V0"
              stroke="#A3A3A3"
              strokeOpacity="0.4"
            />
            <path
              d="M26.5 23H21.5V28C21.5 28.55 21.05 29 20.5 29C19.95 29 19.5 28.55 19.5 28V23H14.5C13.95 23 13.5 22.55 13.5 22C13.5 21.45 13.95 21 14.5 21H19.5V16C19.5 15.45 19.95 15 20.5 15C21.05 15 21.5 15.45 21.5 16V21H26.5C27.05 21 27.5 21.45 27.5 22C27.5 22.55 27.05 23 26.5 23Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      {/* Movie Details Section */}
      <div className="flex-1 flex-col justify-start items-start flex-shrink-0 relative gap-3.5">
        {/* Title */}
        <p className="text-lg font-bold text-left text-text-primary">
          {movie.title}
        </p>

        {/* Runtime/Rating/Year Metadata */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-start items-center flex-shrink-0 gap-2.5">
            <p className="text-base text-left text-text-secondary">
              {releaseYear}
            </p>
            <Dot />
            <p className="text-base text-left text-text-secondary">
              {getCertification()}
            </p>
            <Dot />
            <p className="text-base text-left text-text-secondary">
              {formatRuntime(movie.runtime)}
            </p>
          </div>

          {/* Genres/Tags */}
          <div className="flex justify-start items-start flex-shrink-0 gap-2.5">
            {movie.genres.slice(0, 3).map((genre) => (
              <TagLink
                key={genre.id}
                href={`/protected/movies/genre/${genre.id}`}
                name={genre.name}
              />
            ))}
          </div>

          {/* Description */}
          <p className="flex-shrink-0 w-[518px] text-lg text-left text-text-primary">
            {movie.overview}
          </p>
        </div>

        {/* Rating/Actions Group */}
        <div className="absolute right-0 top-0 flex justify-end items-center h-[21px] gap-2.5">
          {/* IMDB Rating (Uses vote_average and formatted vote_count) */}
          <div className="flex justify-center items-center h-[29px] gap-2.5 px-[7px] rounded-[10px]">
            <div className="flex justify-center items-center gap-[5px]">
              <Star
                className="w-6 h-6 text-[#29BE88] fill-[#29BE88]"
                fill="#29BE88"
                size={24}
              />
              <p className="text-lg text-left">
                <span className="text-text-primary">{formattedRating} </span>
                <span className="text-text-secondary">
                  ({formattedVoteCount})
                </span>
              </p>
            </div>
          </div>

          {/* Rate Button */}
          <div className="flex justify-center items-center h-[25px] gap-2.5 px-[9px] rounded-[10px]">
            <div className="flex justify-center items-center gap-[5px]">
              <Star className="w-6 h-6 text-text-primary" size={24} />
              <p className="text-lg text-left text-text-primary">Rate</p>
            </div>
          </div>

          {/* Info Icon */}
          <div className="flex justify-start items-start gap-[8.33px] rounded-[63.33px]">
            <Info className="w-5 h-5 text-text-secondary" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardHorizontal;
