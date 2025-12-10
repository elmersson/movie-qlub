"use client";

import TagLink from "@/components/genre-tag-link";
import Link from "next/link";
import { SuggestMovieButton } from "@/components/suggest-movie-button";
import { ArrowLeft, Globe } from "lucide-react";
import { useMovieDetails } from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { use, useState } from "react";
import { RatingChip } from "@/components/movies/movie/rating-chip";
import {
  TypographyExtraSmall,
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { Dot } from "@/components/ui/dot";
import Image from "next/image";
import { Chip } from "@/components/ui/chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Storyline } from "@/components/movies/movie/storyline";
import { TmdbMovieReleaseDates } from "@/types/tmdb";
import { MovieCardVertical } from "@/components/movies/movie-card-vertical";
import { YouTubePlayer } from "@/components/ui/youtube-video-player";
import MovieCardHorizontal from "@/components/movies/movie-card-horizontal";
import { ImageZoom } from "@/components/kibo-ui/image-zoom";

// --- TYPE DEFINITIONS ---
type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type VideoResult = {
  key: string;
  site: string;
  type: string;
  name: string;
};

type WatchProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

type WatchProviderData = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
};

interface MoviePageProps {
  params: {
    id: string; // The movie ID from the URL, which is a string
  };
}

export function getSwedishPgLabel(
  releaseDates?: TmdbMovieReleaseDates
): string | null {
  const seCert =
    releaseDates?.results
      .find((r) => r.iso_3166_1 === "SE")
      ?.release_dates.find((d) => d.certification)?.certification || null;

  if (!seCert) return null;

  if (seCert === "Btl") return "PG"; // Allowed with adult

  if (/^\d+$/.test(seCert)) {
    return `PG-${seCert}`;
  }

  return seCert; // fallback if TMDB sends something unexpected
}

export default function MovieDetailPage({ params }: MoviePageProps) {
  // In Next.js App Router, params is a Promise in React Server Components
  // We need to use React.use to unwrap it before accessing its properties
  const resolvedParams = use(params);
  const { id: movieId } = resolvedParams;
  const { data: movie, error, isLoading } = useMovieDetails(movieId);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading movie details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <main className="p-8 text-red-600 text-center font-bold min-h-screen">
        <Link
          href="/"
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        Error loading movie details: {(error as Error).message}
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="p-8 text-red-600 text-center font-bold min-h-screen">
        <Link
          href="/"
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        Movie not found.
      </main>
    );
  }

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w300";

  const SWEDEN_PROVIDERS = movie["watch/providers"]?.SE;
  const topCast = movie.credits?.cast.slice(0, 10) || [];
  const trailers =
    movie.videos?.results.filter(
      (v: VideoResult) => v.type === "Trailer" && v.site === "YouTube"
    ) || [];

  return (
    <main className="min-h-screen">
      {/* Backdrop Image - Fixed height but background covers and centers */}
      {movie.backdrop_path && (
        <div className="absolute top-0 left-0 w-full h-full -z-50 ">
          {/* Backdrop image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" // Removed the non-standard mask classes
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 dark:from-/60 dark:via-black/30 to-transparent backdrop-blur-3xl"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-white/0 dark:from-black/100 dark:via-black/0 to-transparent"></div>
        </div>
      )}

      {/* Content Area */}
      <div className="container mx-auto max-w-5xl p-8">
        <TypographyH1>{movie.title}</TypographyH1>
        <div className="flex flex-row justify-between">
          <div className="flex items-center flex-row gap-2.5">
            <TypographyP className="text-text-secondary">
              {movie.release_date.split("-")[0]}
            </TypographyP>
            <Dot />
            <TypographyP className="text-text-secondary">
              {getSwedishPgLabel(movie.release_dates)}
            </TypographyP>
            <Dot />
            <TypographyP className="text-text-secondary">
              {movie.runtime} min
            </TypographyP>
          </div>
          <div>
            <RatingChip
              vote_average={movie.vote_average}
              vote_count={movie.vote_count}
            />
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="w-1/3">
            {movie.poster_path && (
              <ImageZoom>
                <Image
                  src={`${POSTER_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full aspect-[2/3] object-cover"
                />
              </ImageZoom>
            )}
          </div>
          <div className="w-2/3">
            {trailers && trailers[0] && trailers[0].key && (
              <div className="aspect-video relative">
                <iframe
                  src={`https://www.youtube.com/embed/${trailers[0].key}`}
                  title={trailers[0].name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <div>
            <div className="flex flex-row gap-10">
              <div className="w-full">
                <div className="flex flex-row">
                  <TypographyLarge className="text-text-secondary w-2/12">
                    Genre
                  </TypographyLarge>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: { id: number; name: string }) => (
                      <TagLink
                        key={genre.id}
                        href={`/movies/genre/${genre.id}`}
                        name={genre.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-row">
                  <TypographyLarge className="text-text-secondary w-2/12">
                    Plot
                  </TypographyLarge>
                  <TypographySmall className="text-text-secondary">
                    {movie.overview}
                  </TypographySmall>
                </div>

                <TypographyLarge className="text-text-secondary">
                  Director
                </TypographyLarge>
                <TypographyLarge className="text-text-secondary">
                  Writers
                </TypographyLarge>
                <TypographyLarge className="text-text-secondary">
                  Stars
                </TypographyLarge>
                <TypographyLarge className="text-text-secondary">
                  Awards
                </TypographyLarge>
                <TypographyLarge className="text-text-secondary">
                  Reviews
                </TypographyLarge>
              </div>
            </div>
          </div>
          <SuggestMovieButton movie={movie} />
        </div>

        {/* ⭐️ NEW SECTIONS BELOW MAIN CONTENT ⭐️ */}

        {/* 1. Cast: Horizontal scroll with responsive item widths */}
        {topCast && topCast.length > 0 && (
          <section className="mt-12 border-none">
            <TypographyH2 className="flex items-center overflow-hidden border-none">
              Cast
            </TypographyH2>
            <div className="flex justify-between border-none">
              {topCast.slice(0, 4).map((cast: CastMember) => (
                <div
                  key={cast.id}
                  className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-3 overflow-hidden border-none"
                >
                  <div className="flex-grow-0 flex-shrink-0 w-[181px] h-[181px] relative overflow-hidden rounded-[20px] border-none">
                    <Image
                      src={
                        cast.profile_path
                          ? `${PROFILE_BASE_URL}${cast.profile_path}`
                          : "https://placehold.co/128x128/444444/FFFFFF?text=No+Photo"
                      }
                      alt={cast.name}
                      width={181}
                      height={181}
                      className="w-full h-full object-cover rounded-[20px] overflow-hidden border-none"
                    />
                  </div>
                  <div className="flex-grow-0 flex-shrink-0 text-base text-left overflow-hidden border-none">
                    <span className="flex-grow-0 flex-shrink-0 text-base text-left text-white block">
                      {cast.name}
                    </span>
                    <span className="flex-grow-0 flex-shrink-0 text-base text-left text-[#797979] block border-none">
                      {cast.character}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Watch Providers (Sweden) */}
        {SWEDEN_PROVIDERS && (
          <section className="mt-12 p-6 bg-gray-800 rounded-xl shadow-lg border border-yellow-600/50">
            <h2 className="text-3xl font-bold mb-4 flex items-center text-yellow-500">
              <Globe className="w-6 h-6 mr-2" /> Where to Watch in Sweden
            </h2>

            <a
              href={SWEDEN_PROVIDERS.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline mb-4 block"
            >
              View all providers on TMDb →
            </a>

            {["flatrate", "rent", "buy"].map((type) => {
              const providers = SWEDEN_PROVIDERS[
                type as keyof WatchProviderData
              ] as WatchProvider[] | undefined;
              if (!providers || providers.length === 0) return null;

              return (
                <div key={type} className="mb-6">
                  <h3 className="font-semibold text-xl mb-3 capitalize text-white">
                    {type === "flatrate" ? "Streaming" : type}
                  </h3>
                  {/* Uses responsive grid for logos */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                    {providers.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="flex flex-col items-center w-full"
                      >
                        <div className="w-full aspect-square relative">
                          <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover rounded-xl shadow-md border border-gray-700"
                          />
                        </div>
                        <span className="text-xs text-center mt-1 text-gray-300 line-clamp-2">
                          {provider.provider_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}
        <Storyline />
        {/* 3. Keywords */}
        {movie.keywords && movie.keywords.keywords.length > 0 && (
          <section className="mt-12 flex flex-row items-center gap-4">
            <TypographyLarge className="font-bold">Keywords</TypographyLarge>
            <div className="flex flex-wrap gap-2">
              {movie.keywords.keywords.slice(0, 5).map((keyword) => (
                <TagLink
                  key={keyword.id}
                  href={`/protected/movies/keyword/${keyword.id}`}
                  name={keyword.name}
                />
              ))}
              {movie.keywords.keywords.length > 5 && (
                <Chip
                  className="rounded-full py-1 px-2 hover:bg-neutral-800/80 hover:border-primary-700/30 transition duration-300 cursor-pointer"
                  onClick={() => setShowAllKeywords(true)}
                >
                  <TypographyExtraSmall>
                    +{movie.keywords.keywords.length - 5} more
                  </TypographyExtraSmall>
                </Chip>
              )}
            </div>
          </section>
        )}

        <Dialog open={showAllKeywords} onOpenChange={setShowAllKeywords}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>All Keywords</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 max-h-[60vh] overflow-y-auto">
              {movie.keywords?.keywords.map((keyword) => (
                <TagLink
                  key={keyword.id}
                  href={`/protected/movies/keyword/${keyword.id}`}
                  name={keyword.name}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* 4. Videos */}
        {trailers.length > 0 && (
          <section className="mt-12">
            <TypographyH2>Videos</TypographyH2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trailers.slice(0, 2).map((video: VideoResult) => (
                <YouTubePlayer key={video.key} videoId={video.key} />
              ))}
            </div>
          </section>
        )}

        {movie.images && (
          <section className="mt-12">
            <TypographyH2>Images</TypographyH2>

            <div className="mt-6 flex gap-4 overflow-x-auto">
              {[
                ...(movie.images.posters ?? []),
                ...(movie.images.backdrops ?? []),
              ]
                .slice(0, 3) // limit for performance
                .map((img) => (
                  <div
                    key={img.file_path}
                    className="relative flex-shrink-0 w-[264px] h-[264px] rounded-[10px] overflow-hidden bg-black"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="264px"
                    />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* 5. Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <section className="mt-12">
            <TypographyH2>Similar Movies</TypographyH2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
              {movie.similar.results.slice(0, 8).map((similarMovie) => (
                <div key={similarMovie.id}>
                  <MovieCardVertical
                    id={similarMovie.id}
                    src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                    title={similarMovie.title}
                    vote_average={similarMovie.vote_average}
                    vote_count={similarMovie.vote_count}
                    onPlusClick={() => console.log("added movie")}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
