// lib/queries.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import type { TmdbMovieDetailsWithAppendices } from '@/types/tmdb'

// Define types
type Movie = TmdbMovieDetailsWithAppendices;

interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
  [key: string]: any; // Allow additional properties
}

// Helper function to fetch data from TMDB API
async function fetchTMDB(endpoint: string): Promise<any> {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!TMDB_API_KEY) {
    throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not set in environment variables')
  }

  // Handle endpoints with existing query parameters
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `https://api.themoviedb.org/3${endpoint}${separator}api_key=${TMDB_API_KEY}&language=en-US`
  const res = await fetch(url)
  
  if (!res.ok) {
    throw new Error(`Failed to fetch from TMDB: ${res.status}`)
  }
  
  return res.json()
}

// Query hooks
export function usePopularMovies() {
  return useQuery<MovieResponse>({
    queryKey: ['popularMovies'],
    queryFn: () => fetchTMDB('/movie/popular'),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useMovieDetails(movieId: number | string) {
  const isValidMovieId = movieId && !isNaN(Number(movieId)) && Number(movieId) > 0;
  
  return useQuery<Movie>({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      if (!isValidMovieId) {
        throw new Error('Invalid movie ID');
      }
      
      const appendices = "credits,keywords,similar,videos,images,watch/providers,release_dates,reviews";
      const data = await fetchTMDB(`/movie/${movieId}?append_to_response=${appendices}`)
      return data
    },
    enabled: isValidMovieId ? true : false,
  })
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchTMDB('/genre/movie/list'),
  })
}

export function useMoviesByGenre(genreId: number) {
  return useQuery<MovieResponse>({
    queryKey: ['moviesByGenre', genreId],
    queryFn: () => fetchTMDB(`/discover/movie?with_genres=${genreId}`),
    enabled: !!genreId,
  })
}