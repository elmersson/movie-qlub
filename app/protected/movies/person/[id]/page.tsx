// /app/(protected)/person/[id]/page.tsx

"use client";

import React from "react";
import { usePersonDetails } from "@/lib/queries";
import Image from "next/image";
import {
  Film,
  Calendar,
  User,
  Briefcase,
  ChevronRight,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Base URL for TMDb images
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Helper to format currency (if needed, though less common for person data)
const formatCurrency = (amount: number | undefined) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface PersonPageProps {
  // Keep the params type as the standard Next.js object
  // The Promise behavior is an internal implementation detail we should resolve, not type.
  params: {
    id: string;
  };
}

// NOTE: The 'person' object type here would be TmdbPersonDetailsWithAppendices
export default function PersonPage({ params }: PersonPageProps) {
  const resolvedParams = (React.use as any)(params);

  const personId = resolvedParams.id as string;
  // Fetch person details, images, and movie credits
  const { data: person, isLoading, error } = usePersonDetails(personId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Person
        Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500 text-xl">
        Error fetching data: {(error as Error).message}
      </div>
    );
  }

  // Type guard for routing errors/invalid IDs returned by the API
  if (!person || (person as { success: false }).success === false) {
    notFound();
  }

  // Sort credits by popularity and release date (descending)
  const sortedCredits =
    person.movie_credits?.cast
      .filter((c: any) => c.release_date) // Filter out movies without a release date
      .sort((a: any, b: any) => {
        // Primary sort by popularity (desc)
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity;
        }
        // Secondary sort by release date (desc)
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      }) || [];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-10 px-4">
      {/* --- HEADER: Name and Primary Info --- */}
      <div className="flex gap-8 mb-10">
        {/* Profile Image */}
        <div className="w-64 flex-shrink-0">
          {person.profile_path ? (
            <Image
              src={`${IMAGE_BASE_URL}w500${person.profile_path}`}
              alt={person.name}
              width={300}
              height={450}
              className="rounded-lg shadow-xl"
            />
          ) : (
            <div className="w-64 h-[450px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 flex-grow">
          <h1 className="text-5xl font-extrabold">{person.name}</h1>

          <div className="grid grid-cols-2 gap-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> **Known For:**{" "}
              {person.known_for_department}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> **Gender:**{" "}
              {person.gender === 2
                ? "Male"
                : person.gender === 1
                ? "Female"
                : "Unknown"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> **Birthday:**{" "}
              {formatDate(person.birthday)}
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" /> **Place of Birth:**{" "}
              {person.place_of_birth || "N/A"}
            </div>
          </div>

          {person.homepage && (
            <a
              href={person.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" /> Official Website
            </a>
          )}

          <h2 className="text-2xl font-bold mt-4">Biography</h2>
          <p className="text-gray-700 leading-relaxed">
            {person.biography ||
              `We are still gathering biography information for ${person.name}.`}
          </p>
        </div>
      </div>

      {/* --- FILMOGRAPHY SECTION --- */}
      <div className="mt-10 pt-8 border-t">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Film className="w-6 h-6" /> Filmography (Cast)
        </h2>

        <div className="space-y-4">
          {sortedCredits.length > 0 ? (
            sortedCredits.map((credit: any) => (
              <div
                key={credit.credit_id}
                className="flex items-center border p-3 rounded-lg hover:bg-gray-50 transition duration-150"
              >
                {/* Year */}
                <span className="w-20 font-mono text-sm text-gray-500 flex-shrink-0">
                  {credit.release_date
                    ? new Date(credit.release_date).getFullYear()
                    : "TBD"}
                </span>
                {/* Title and Character */}
                <Link
                  href={`/protected/movies/${credit.id}`}
                  className="flex-grow flex items-baseline gap-2 group"
                >
                  <span className="font-semibold text-lg group-hover:text-blue-600">
                    {credit.title}
                  </span>
                  <span className="text-gray-500 text-sm italic">
                    as {credit.character || "N/A"}
                  </span>
                </Link>
                {/* Rating */}
                <div className="w-24 text-right flex items-center justify-end text-sm">
                  <span className="text-yellow-500">★ </span>
                  <span>
                    {credit.vote_average
                      ? credit.vote_average.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No movie credits found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
