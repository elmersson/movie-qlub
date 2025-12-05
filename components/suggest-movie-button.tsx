// /components/suggest-movie-button.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";

export function SuggestMovieButton({ movie }: { movie: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggested, setIsSuggested] = useState(false);
  const supabase = createClient();

  const handleSuggest = async () => {
    setIsLoading(true);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        // Redirect to login if not authenticated
        window.location.href = "/auth/login";
        return;
      }
      
      // Check if user has a profile, create one if not
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      
      if (profileError || !profile) {
        // Create profile for user if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: user.email?.split("@")[0] || user.id,
            email: user.email,
            role: "user"
          });
        
        if (insertError) {
          console.error("Error creating user profile:", insertError);
          alert("Error: Could not create user profile");
          return;
        }
      }
      
      // Get the current active voting cycle (one where we're in the suggestion phase)
      const { data: votingCycle, error: cycleError } = await supabase
        .from("VotingCycle")
        .select("id")
        .lt("suggestionStart", new Date().toISOString())
        .gt("votingStart", new Date().toISOString())
        .single();
      
      if (cycleError) {
        console.error("Error finding active voting cycle:", cycleError);
        alert("Error: Could not find an active voting cycle");
        return;
      }
      
      if (!votingCycle) {
        alert("No active voting cycle found");
        return;
      }
      
      // Check if user already suggested this movie in the current cycle
      const { data: existingSuggestion, error: existingError } = await supabase
        .from("suggestion")
        .select("id")
        .eq("cycleId", votingCycle.id)
        .eq("submittedById", user.id)
        .eq("imdbId", movie.imdb_id || null)
        .maybeSingle();
      
      if (existingError) {
        console.error("Error checking existing suggestion:", existingError);
        alert("Error checking existing suggestion");
        return;
      }
      
      if (existingSuggestion) {
        alert("You have already suggested this movie in the current voting cycle");
        setIsSuggested(true);
        setIsLoading(false);
        return;
      }
      
      // Insert the suggestion
      const { error: suggestionError } = await supabase
        .from("suggestion")
        .insert({
          movieTitle: movie.title,
          movieDetails: JSON.stringify(movie),
          cycleId: votingCycle.id,
          submittedById: user.id,
          imdbId: movie.imdb_id || null,
          year: movie.release_date ? movie.release_date.split("-")[0] : null,
          runtime: movie.runtime ? movie.runtime.toString() : null,
          genre: movie.genres ? movie.genres.map((g: any) => g.name).join(", ") : null,
          director: movie.credits?.crew?.find((person: any) => person.job === "Director")?.name || null,
          plot: movie.overview || null,
          posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          imdbRating: movie.vote_average ? movie.vote_average.toString() : null,
        });
      
      if (suggestionError) {
        console.error("Error suggesting movie:", suggestionError);
        alert("Error suggesting movie: " + suggestionError.message);
        return;
      }
      
      setIsSuggested(true);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSuggest}
      disabled={isLoading || isSuggested}
      className={`flex items-center ${
        isSuggested 
          ? "bg-green-600 cursor-default" 
          : "bg-blue-600 hover:bg-blue-700"
      } text-white px-4 py-2 rounded-lg transition`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Suggesting...
        </>
      ) : isSuggested ? (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Suggested!
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Suggest Movie
        </>
      )}
    </button>
  );
}