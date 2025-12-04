import GenreTagLink from "@/components/genre-tag-link";
import MovieCard from "@/components/movie-card"; // Used for similar movies
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Globe,
  User,
  Tag,
  Video,
} from "lucide-react";

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

type ImageResult = {
  file_path: string;
  aspect_ratio: number;
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

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number | null;
  genres: { id: number; name: string }[];
  vote_average: number;
  tagline: string;
  budget: number;
  revenue: number;
  original_language: string;
  status: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];

  // APPENDED DATA TYPES
  credits: { cast: CastMember[] };
  keywords: { keywords: { id: number; name: string }[] };
  similar: { results: MovieDetails[] };
  videos: { results: VideoResult[] };
  images: { backdrops: ImageResult[]; posters: ImageResult[] };
  "watch/providers": { results: { SE?: WatchProviderData } };
};

interface MoviePageProps {
  params: {
    id: string; // The movie ID from the URL, which is a string
  };
}

// ----------------------------------------------------
// SERVER FETCH FUNCTION (Remains the same)
// ----------------------------------------------------
async function getMovieDetails(movieId: string): Promise<MovieDetails> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("Configuration Error: TMDB_API_KEY is missing.");
  }

  const appendices = "credits,keywords,similar,videos,images,watch/providers";
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=${appendices}`;

  const options = {
    method: "GET",
    headers: { accept: "application/json" },
    next: { revalidate: 3600 },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Movie with ID ${movieId} not found.`);
    }
    throw new Error(`Failed to fetch movie details. Status: ${res.status}`);
  }

  const data: MovieDetails = await res.json();
  return data;
}

// ----------------------------------------------------
// SERVER COMPONENT
// ----------------------------------------------------
export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id: movieId } = await params;
  let movie: MovieDetails | null = null;
  let error: string | null = null;

  try {
    if (movieId) {
      movie = await getMovieDetails(movieId);
    } else {
      error = "No Movie ID found in the URL.";
    }
  } catch (e: any) {
    console.error("Movie Detail Fetch Error:", e.message);
    error = e.message;
  }

  if (error || !movie) {
    const displayId = movieId || "N/A";
    return (
      <main className="p-8 text-red-600 text-center font-bold min-h-screen">
        <Link
          href="/"
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        Error loading movie details for ID: **{displayId}**. {error}
      </main>
    );
  }

  // Helper functions
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";

  const SWEDEN_PROVIDERS = movie["watch/providers"]?.results?.SE;
  const topCast = movie.credits.cast.slice(0, 10);
  const trailers = movie.videos.results.filter(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <main className="min-h-screen">
      {/* Backdrop Image - Fixed height but background covers and centers */}
      {movie.backdrop_path && (
        <div
          className="relative h-96 bg-cover bg-center bg-no-repeat -z-50"
          style={{
            backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Content Area */}
      <div className="container mx-auto max-w-5xl -mt-40 p-8">
        <Link
          href="/"
          className="flex items-center text-white hover:text-blue-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Popular Movies
        </Link>
        <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
          {/* Poster: Uses max-w-xs on mobile and flex-shrink on desktop for responsiveness */}
          {movie.poster_path && (
            // ⭐️ FIX: Use max-w-xs and let flex handle desktop sizing ⭐️
            <div className="w-full max-w-xs mx-auto mb-6 md:mb-0 md:mx-0 md:max-w-[18rem] md:shrink-0 h-auto rounded-xl shadow-xl overflow-hidden">
              <img
                src={`${POSTER_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          )}

          {/* Details: Takes up remaining space */}
          <div className="flex flex-col justify-center w-full md:flex-grow">
            <h1 className="text-5xl font-extrabold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl italic text-gray-500 mb-4">
                {movie.tagline}
              </p>
            )}

            {/* Runtime, Rating, Release Year */}
            <div className="flex items-center space-x-4 mb-6 text-sm text-gray-400">
              <span className="font-semibold text-lg text-yellow-500">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span>|</span>
              <span>{movie.runtime} min</span>
              <span>|</span>
              <span>{movie.release_date.split("-")[0]}</span>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              {movie.overview}
            </p>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-lg">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <GenreTagLink
                    key={genre.id}
                    genreId={genre.id}
                    genreName={genre.name}
                  />
                ))}
              </div>
            </div>

            {/* Financial & Production Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm py-4 border-y border-gray-700/50">
              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  Status
                </h4>
                <p className="font-medium text-white">{movie.status}</p>
              </div>

              {/* Original Language */}
              <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  Original Language
                </h4>
                <p className="font-medium text-white">
                  {movie.original_language.toUpperCase()}
                </p>
              </div>

              {/* Production Countries */}
              <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  Produced In
                </h4>
                <p className="font-medium text-white">
                  {movie.production_countries.map((c) => c.name).join(", ")}
                </p>
              </div>

              {/* Financial Details */}
              <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  Budget
                </h4>
                <p className="font-medium text-lg text-green-400">
                  {formatCurrency(movie.budget)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  Revenue
                </h4>
                <p className="font-medium text-lg text-green-400">
                  {formatCurrency(movie.revenue)}
                </p>
              </div>
            </div>

            <hr className="my-4 border-gray-700" />

            {/* Production Companies (Text-based and flexible) */}
            {movie.production_companies.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-3 text-lg">Production Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.production_companies.map((company) => (
                    <span
                      key={company.id}
                      className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full border border-gray-600"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ⭐️ NEW SECTIONS BELOW MAIN CONTENT ⭐️ */}

        {/* 1. Cast: Horizontal scroll with responsive item widths */}
        {topCast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-500" /> Top Cast
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
              {topCast.map((cast) => (
                // Item width adjusted to be slightly flexible but constrained for scrolling
                <div
                  key={cast.id}
                  className="flex-shrink-0 w-24 sm:w-32 text-center"
                >
                  <div className="relative w-full aspect-square mb-2">
                    <img
                      src={
                        cast.profile_path
                          ? `${PROFILE_BASE_URL}${cast.profile_path}`
                          : "https://placehold.co/128x128/444444/FFFFFF?text=No+Photo"
                      }
                      alt={cast.name}
                      className="w-full h-full object-cover rounded-full mx-auto border-4 border-gray-700/50"
                    />
                  </div>
                  <p className="font-semibold text-xs sm:text-sm line-clamp-2">
                    {cast.name}
                  </p>
                  <p className="text-xxs sm:text-xs text-gray-400 line-clamp-2">
                    {cast.character}
                  </p>
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
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
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

        {/* 3. Keywords */}
        {movie.keywords.keywords.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <Tag className="w-6 h-6 mr-2 text-blue-500" /> Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {movie.keywords.keywords.map((keyword) => (
                <Link
                  key={keyword.id}
                  href={`/protected/movies/keyword/${keyword.id}`}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-1 rounded-full transition"
                >
                  {keyword.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. Trailers (Videos) */}
        {trailers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <Video className="w-6 h-6 mr-2 text-blue-500" /> Trailers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trailers.slice(0, 2).map((video) => (
                <div
                  key={video.key}
                  className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
                >
                  <div className="aspect-video relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full absolute inset-0"
                    />
                  </div>
                  <p className="p-3 text-sm font-semibold bg-gray-700/50">
                    {video.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Similar Movies */}
        {movie.similar.results.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <ImageIcon className="w-6 h-6 mr-2 text-blue-500" /> Similar
              Movies
            </h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
              {movie.similar.results.slice(0, 8).map((similarMovie) => (
                <div
                  key={similarMovie.id}
                  className="flex-shrink-0 w-36 sm:w-48"
                >
                  <MovieCard movie={similarMovie as unknown as any} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
