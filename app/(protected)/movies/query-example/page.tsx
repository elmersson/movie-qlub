// app/(protected)/movies/query-example/page.tsx
'use client'

import { usePopularMovies } from '@/lib/queries'
import MovieCard from '@/components/movie-card'

export default function QueryExamplePage() {
  const { data, error, isLoading } = usePopularMovies()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading popular movies...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center font-bold">
        Error: {(error as Error).message}
      </div>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Popular Movies (TanStack Query Example)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.results.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  )
}