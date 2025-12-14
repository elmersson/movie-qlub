"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useMovieSearch } from "@/lib/queries";
import { Film, Calendar, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button
import { useRouter } from "next/navigation";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}

// ---------------------------------------------------------------------
// 1. Context and State Management (Handles the dialog state globally)
// ---------------------------------------------------------------------
const SearchContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut to open the command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the context
const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 2. Button Trigger (Used in Layout)
// ---------------------------------------------------------------------

export function MovieSearchButton() {
  const { setOpen } = useSearch();

  return (
    <Button
      variant="outline"
      className="flex items-center justify-between gap-4 w-48 text-sm text-muted-foreground"
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span>Search movies...</span>
      </div>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}

// ---------------------------------------------------------------------
// 3. Command Dialog (Used in Layout)
// ---------------------------------------------------------------------

export function MovieCommandDialog() {
  const { open, setOpen } = useSearch();
  const router = useRouter(); // ⭐️ Initialize useRouter

  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Apply debounce to the query that feeds the hook
  const handleQueryChange = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleQueryChange(value);
  };

  // ⭐️ USE THE HOOK ⭐️
  const {
    data: results,
    isLoading,
    isFetching,
    error,
  } = useMovieSearch(debouncedQuery);

  const getYear = (date: string) =>
    date ? new Date(date).getFullYear() : "N/A";
  const showLoading = isLoading || isFetching;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for a movie title..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
      <CommandList>
        {error && (
          <p className="text-red-500 text-sm p-4">
            Error: Failed to load results.
          </p>
        )}

        {showLoading && (
          <div className="p-4 text-center text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />{" "}
            Searching...
          </div>
        )}

        <CommandEmpty>
          {debouncedQuery.length > 2
            ? `No results found for "${debouncedQuery}".`
            : "Start typing to search TMDb..."}
        </CommandEmpty>

        {results && results.length > 0 && (
          <CommandGroup heading={`Top ${results.length} Results`}>
            {results.map((movie) => (
              <CommandItem
                key={movie.id}
                value={movie.title}
                onSelect={() => {
                  const path = `/protected/movies/${movie.id}`;
                  router.push(path);

                  console.log(`Selected movie ID: ${movie.id}`);
                  setOpen(false);
                }}
                className="flex items-center gap-3"
              >
                {/* Poster Image */}
                {movie.poster_path ? (
                  <div className="relative w-8 h-12 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <Film className="w-8 h-12 text-gray-400 p-2 border rounded flex-shrink-0" />
                )}

                {/* Title and Year */}
                <div className="flex flex-col flex-grow truncate">
                  <span className="font-medium truncate">{movie.title}</span>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{getYear(movie.release_date)}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
        <CommandItem className="text-muted-foreground text-xs">
          <Search className="w-4 h-4 mr-2" /> Powered by TMDb
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
}
