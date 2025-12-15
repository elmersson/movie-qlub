export interface TmdbMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbMovieCredits {
  id: number;
  cast: Array<{
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }>;
  crew: Array<{
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
  }>;
}

export interface TmdbMovieImages {
  id: number;
  backdrops: Array<{
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
  logos: Array<{
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
  posters: Array<{
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }>;
}

export interface TmdbMovieVideos {
  id: number;
  results: Array<{
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
  }>;
}

export type TmdbVideoResult = TmdbMovieVideos["results"][number];


export interface TmdbMovieWatchProviders {
  [countryCode: string]: {
    link: string;
    flatrate?: Array<{
      logo_path: string;
      provider_id: number;
      provider_name: string;
      display_priority: number;
    }>;
    rent?: Array<{
      logo_path: string;
      provider_id: number;
      provider_name: string;
      display_priority: number;
    }>;
    buy?: Array<{
      logo_path: string;
      provider_id: number;
      provider_name: string;
      display_priority: number;
    }>;
  };
}

export interface TmdbMovieReleaseDates {
  id: number;
  results: Array<{
    iso_3166_1: string; // Country code (e.g. "US", "SE")
    release_dates: Array<{
      certification: string; // e.g. "PG-13", "R", "15"
      descriptors: string[];
      iso_639_1: string;
      note: string;
      release_date: string; // ISO timestamp
      type: number; // 1 = Premiere, 3 = Theatrical, etc.
    }>;
  }>;
}

export interface TmdbMovieReviews {
  id: number;
  page: number;
  results: Array<{
    author: string;
    author_details: {
      name: string;
      username: string;
      avatar_path: string | null;
      rating: number | null; // 0–10 or null
    };
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
  }>;
  total_pages: number;
  total_results: number;
}

// Extended type for movie details with all appendices
export interface TmdbMovieDetailsWithAppendices extends TmdbMovieDetails {
  credits?: TmdbMovieCredits;
  keywords?: {
    id: number;
    keywords: Array<{
      id: number;
      name: string;
    }>;
  };
  similar?: {
    results: TmdbMovieDetails[];
  };
  videos?: TmdbMovieVideos;
  images?: TmdbMovieImages;
  "watch/providers"?: TmdbMovieWatchProviders;
  release_dates?: TmdbMovieReleaseDates;
  reviews?: TmdbMovieReviews;
}

// Assuming this is in your /src/types/tmdb.ts file or similar

/**
 * Interface for the core TMDb Person Details object.
 * (Reference: /reference/person-details)
 */
export interface TmdbPersonDetails {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null; // ISO 8601 date string
    deathday: string | null;
    gender: 0 | 1 | 2 | 3; // 1: Female, 2: Male, 0/3: Not specified
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    known_for_department: string; // e.g., "Acting", "Directing"
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
}

/**
 * Interface for the Person Images appended data.
 * (Reference: /reference/person-images)
 */
export interface TmdbPersonImages {
    id: number;
    profiles: Array<{
        aspect_ratio: number;
        height: number;
        iso_639_1: string | null;
        file_path: string;
        vote_average: number;
        vote_count: number;
        width: number;
    }>;
}

/**
 * Interface for the Person Movie Credits appended data.
 * (Reference: /reference/person-movie-credits)
 */
export interface TmdbPersonMovieCredits {
    cast: Array<{
        adult: boolean;
        backdrop_path: string | null;
        character: string;
        credit_id: string;
        genre_ids: number[];
        id: number;
        order: number;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string | null;
        release_date: string | null;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }>;
    crew: Array<{
        adult: boolean;
        backdrop_path: string | null;
        credit_id: string;
        department: string;
        job: string;
        genre_ids: number[];
        id: number;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string | null;
        release_date: string | null;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }>;
    id: number;
}


/**
 * The final merged type used by the usePersonDetails hook.
 * Combines core details with the appended data structures.
 */
export interface TmdbPersonDetailsWithAppendices extends TmdbPersonDetails {
    // Appended Data
    images?: TmdbPersonImages;
    movie_credits?: TmdbPersonMovieCredits;
    
    // TMDb uses this to return errors (e.g., if ID is invalid)
    success?: boolean; 
    status_code?: number;
    status_message?: string;
}