import MovieCard from "@/components/movie-card"; // Assuming path to MovieCard
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Define the expected structure for a movie from the discovery endpoint
type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
};

// Define the props passed to this dynamic route
interface GenrePageProps {
  params: {
    id: string; // The Genre ID from the URL
  };
}

// ----------------------------------------------------
// SERVER FETCH FUNCTION
// ----------------------------------------------------
/**
 * Fetches movies filtered by a specific genre ID.
 * It also fetches the genre name separately for the title.
 */
async function getMoviesByGenre(
  genreId: string
): Promise<{ movies: Movie[]; genreName: string }> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error(
      "Configuration Error: NEXT_PUBLIC_TMDB_API_KEY is missing."
    );
  }

  // 1. Fetch Movies by Genre ID (using the /discover endpoint)
  const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`;

  const movieOptions = {
    method: "GET",
    headers: { accept: "application/json" },
    next: { revalidate: 3600 },
  };

  const movieRes = await fetch(movieUrl, movieOptions);

  if (!movieRes.ok) {
    throw new Error(
      `Failed to fetch movies for genre ${genreId}. Status: ${movieRes.status}`
    );
  }
  const movieData = await movieRes.json();

  // 2. Determine Genre Name (Fetching all genres and mapping the ID)
  // This is cached globally and rarely changes, so we fetch it to get the readable name.
  const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
  const genresRes = await fetch(genresUrl, {
    headers: { accept: "application/json" },
    // Cache longer, since genre lists are static
    next: { revalidate: 86400 },
  });

  const genresData = await genresRes.json();
  const genre = genresData.genres.find((g: any) => g.id.toString() === genreId);
  const genreName = genre ? genre.name : `Unknown Genre (${genreId})`;

  return { movies: movieData.results, genreName };
}

// ----------------------------------------------------
// SERVER COMPONENT
// ----------------------------------------------------
export default async function GenreMoviesPage({ params }: GenrePageProps) {
  // Use await to resolve the dynamic params object
  const { id: genreId } = await params;

  let movieData: { movies: Movie[]; genreName: string } | null = null;
  let error: string | null = null;

  try {
    if (genreId) {
      movieData = await getMoviesByGenre(genreId);
    } else {
      error = "No Genre ID found in the URL.";
    }
  } catch (e: any) {
    console.error("Genre Movie Fetch Error:", e.message);
    error = e.message;
  }

  if (error || !movieData || movieData.movies.length === 0) {
    return (
      <main className="p-8 min-h-screen">
        <Link
          href="/protected"
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Popular Movies
        </Link>
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Discovery Failed</h2>
          <p className="text-red-600">
            {error || `No movies found for Genre ID: ${genreId}.`}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 min-h-screen">
      <Link
        href="/protected"
        className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Popular Movies
      </Link>

      <h1 className="text-4xl font-extrabold mb-8">
        Movies in Genre:{" "}
        <span className="text-blue-600">{movieData.genreName}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movieData.movies.map((movie) => (
          // Use the existing MovieCard component for rendering
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
