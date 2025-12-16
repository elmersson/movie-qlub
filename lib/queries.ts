// lib/queries.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import type { TmdbMovieDetailsWithAppendices, TmdbPersonDetailsWithAppendices } from '@/types/tmdb'

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

// Define the simplified result type for the search bar UI
interface SearchResult {
    id: number;
    title: string;
    release_date: string;
    poster_path: string | null;
}

// 🌟 NEW QUERY HOOK FOR MOVIE SEARCH 🌟
export function useMovieSearch(query: string) {
    // Only search if the query is at least 3 characters long
    const isSearchEnabled = query.length >= 3;

    return useQuery<MovieResponse, Error, SearchResult[]>({
        queryKey: ['movieSearch', query],
        queryFn: async () => {
            if (!isSearchEnabled) {
                // Should be unreachable due to 'enabled' flag, but good practice
                return { results: [] }; 
            }
            // Use the TMDb search endpoint
            const data = await fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`)
            return data;
        },
        // We use a select function to transform the full MovieResponse into the simplified SearchResult[] needed for the Command palette.
        select: (data: MovieResponse): SearchResult[] => {
            return data.results
                .map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    release_date: movie.release_date || '',
                    poster_path: movie.poster_path,
                }))
                .filter(movie => movie.title && movie.release_date) // Basic filtering
                .slice(0, 10); // Limit results for a cleaner command palette
        },
        enabled: isSearchEnabled,
        // Search results should not be aggressively cached
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10,  // 10 minutes
    });
}

export function usePersonDetails(personId: number | string) {
    
    const numericPersonId = Number(personId);
    
    // 1. Clean up the 'isValidPersonId' calculation to clearly yield a boolean.
    const isValidPersonId = !isNaN(numericPersonId) && numericPersonId > 0;
    
    return useQuery<TmdbPersonDetailsWithAppendices>({ 
        queryKey: ['person', personId],
        
        queryFn: async () => {
            // 2. Ensure NO early 'return' without throwing an error if 'enabled' is false.
            // Since we rely on 'enabled', this 'if' block is technically unnecessary but
            // useful for runtime checks if the dependency structure is complex.
            if (!isValidPersonId) {
                // Throwing an error ensures a non-data return path is handled gracefully by TanStack Query
                throw new Error('Invalid person ID provided'); 
            }
            
            // Note: Since 'isValidPersonId' is checked above, this path WILL be executed 
            // only when 'enabled' is true.
            const appendices = "images,movie_credits";
            
            // 3. Ensure fetchTMDB is typed or we use 'as' to assert the type.
            const data = await fetchTMDB(`/person/${personId}?append_to_response=${appendices}`);
            
            // Assert that the returned data matches the expected type before returning.
            return data as TmdbPersonDetailsWithAppendices; 
        },
        
        enabled: isValidPersonId, // 4. 'enabled' is now purely boolean
        staleTime: 1000 * 60 * 60 * 24, 
    });
}

export interface TmdbKeyword {
    id: number;
    name: string;
}

export interface TmdbKeywordResponse {
    results: TmdbKeyword[];
    page: number;
    total_pages: number;
    total_results: number;
}


// 🌟 NEW QUERY HOOK FOR MOVIES BY KEYWORD 🌟
export function useMoviesByKeyword(keywordId: number | string) {
    const numericKeywordId = Number(keywordId);
    
    const isValidKeywordId = !isNaN(numericKeywordId) && numericKeywordId > 0;
    
    // Uses the standard MovieResponse format
    return useQuery<MovieResponse>({ 
        queryKey: ['moviesByKeyword', keywordId],
        queryFn: async () => {
            if (!isValidKeywordId) {
                throw new Error('Invalid keyword ID provided'); 
            }
            
            // Reference: /keyword/{keyword_id}/movies
            const data = await fetchTMDB(`/keyword/${keywordId}/movies`);
            
            // Assert that the returned data matches the expected type
            return data as MovieResponse; 
        },
        enabled: isValidKeywordId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}