// app/page.tsx (Server Component)

import MovieCard from "@/components/movie-card";

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
};

// Data fetching function - runs securely on the server
async function getPopularMovies(): Promise<Movie[]> {
  // ⭐️ 1. Get API Key from environment variable ⭐️
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error(
      "Configuration Error: NEXT_PUBLIC_TMDB_API_KEY is not set in .env.local"
    );
  }

  // ⭐️ 2. Construct the URL with the API Key ⭐️
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`TMDb API Error: HTTP status ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}

// ----------------------------------------------------

export default async function HomePage() {
  let movies: Movie[] = [];
  let error: string | null = null;

  try {
    movies = await getPopularMovies();
  } catch (e: any) {
    console.error("Server Fetch Error:", e.message);
    error =
      "Failed to load movies. Switched to v3 API Key method. Check your .env.local file and restart the server (bun run dev).";
  }

  if (error) {
    return (
      <main className="p-8 text-red-600 text-center font-bold">
        Error: {error}
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
