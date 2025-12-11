import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Link from "next/link";
import MovieCardHorizontal from "@/components/movies/movie-card-horizontal";

async function VotingCycleDetails({ id }: { id: string }) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the specific voting cycle
  const { data: votingCycle, error: cycleError } = await supabase
    .from("VotingCycle")
    .select("*")
    .eq("id", id)
    .single();

  if (cycleError) {
    console.error("Error loading voting cycle:", cycleError);
    return (
      <div className="text-red-500">
        Error loading voting cycle: {cycleError.message}
      </div>
    );
  }

  if (!votingCycle) {
    return <div className="text-red-500">Voting cycle not found.</div>;
  }

  // Fetch suggestions for this voting cycle
  const { data: suggestions, error: suggestionsError } = await supabase
    .from("suggestion")
    .select(
      `
      id,
      movieTitle,
      movieDetails,
      submittedAt,
      imdbId,
      year,
      runtime,
      genre,
      director,
      plot,
      posterUrl,
      imdbRating,
      submittedById,
      profiles (username, email)
    `
    )
    .eq("cycleId", id)
    .order("submittedAt", { ascending: true });

  if (suggestionsError) {
    console.error("Error loading suggestions:", suggestionsError);
  }

  // Determine current phase
  const now = new Date();
  const suggestionStart = new Date(votingCycle.suggestionStart);
  const votingStart = new Date(votingCycle.votingStart);
  const votingEnd = new Date(votingCycle.votingEnd);

  let currentPhase = "Not Started";
  if (now >= suggestionStart && now < votingStart) {
    currentPhase = "Suggestion Phase";
  } else if (now >= votingStart && now < votingEnd) {
    currentPhase = "Voting Phase";
  } else if (now >= votingEnd) {
    currentPhase = "Ended";
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <Link
          href="/protected/voting-cycles"
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          ← Back to all voting cycles
        </Link>
      </div>

      <div className="border rounded-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-bold text-2xl mb-2">{votingCycle.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentPhase === "Not Started"
                    ? "bg-gray-200 text-gray-800"
                    : currentPhase === "Suggestion Phase"
                    ? "bg-blue-200 text-blue-800"
                    : currentPhase === "Voting Phase"
                    ? "bg-green-200 text-green-800"
                    : "bg-purple-200 text-purple-800"
                }`}
              >
                {currentPhase}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-gray-500 text-sm mb-1">
              Suggestion Period
            </h3>
            <p className="font-medium">
              {suggestionStart.toLocaleDateString()} -{" "}
              {votingStart.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {suggestionStart.toLocaleTimeString()} -{" "}
              {votingStart.toLocaleTimeString()}
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium text-gray-500 text-sm mb-1">
              Voting Period
            </h3>
            <p className="font-medium">
              {votingStart.toLocaleDateString()} -{" "}
              {votingEnd.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {votingStart.toLocaleTimeString()} -{" "}
              {votingEnd.toLocaleTimeString()}
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium text-gray-500 text-sm mb-1">Status</h3>
            <p className="font-medium">{currentPhase}</p>
            <p className="text-sm text-gray-500 mt-1">
              {currentPhase === "Ended" && votingCycle.winnerId
                ? "Winner selected"
                : currentPhase === "Ended"
                ? "No winner yet"
                : "In progress"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-bold text-xl mb-4">Suggestions</h2>
          {!suggestions || suggestions.length === 0 ? (
            <p className="text-gray-500">No suggestions yet.</p>
          ) : (
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => {
                const parsedMovie = suggestion.movieDetails
                  ? JSON.parse(suggestion.movieDetails)
                  : null;

                const movieForCard = parsedMovie
                  ? {
                      title: parsedMovie.title,
                      release_date: parsedMovie.release_date || null,
                      runtime: parsedMovie.runtime || null,
                      poster_path:
                        parsedMovie.poster_path || suggestion.posterUrl || null,
                      overview: parsedMovie.overview || suggestion.plot || "",
                      vote_average:
                        parsedMovie.vote_average ||
                        (suggestion.imdbRating
                          ? parseFloat(suggestion.imdbRating)
                          : 0),
                      vote_count: parsedMovie.vote_count || 0,
                      genres:
                        parsedMovie.genres ||
                        (suggestion.genre
                          ? [{ id: 0, name: suggestion.genre }]
                          : []),
                      release_dates: parsedMovie.release_dates || undefined,
                    }
                  : {
                      title: suggestion.movieTitle,
                      release_date: null,
                      runtime: suggestion.runtime
                        ? parseInt(suggestion.runtime)
                        : null,
                      poster_path: suggestion.posterUrl || null,
                      overview: suggestion.plot || "",
                      vote_average: suggestion.imdbRating
                        ? parseFloat(suggestion.imdbRating)
                        : 0,
                      vote_count: 0,
                      genres: suggestion.genre
                        ? [{ id: 0, name: suggestion.genre }]
                        : [],
                    };

                return (
                  <MovieCardHorizontal
                    key={suggestion.id}
                    movie={movieForCard}
                    imageBaseUrl="https://image.tmdb.org/t/p/w500"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function VotingCyclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="w-full">
        <h1 className="font-bold text-2xl mb-4">Voting Cycle Details</h1>
        <p className="text-foreground">
          View details and suggestions for this voting cycle.
        </p>
      </div>

      <div className="w-full">
        <Suspense fallback={<div>Loading voting cycle...</div>}>
          <VotingCycleDetails id={id} />
        </Suspense>
      </div>
    </div>
  );
}
