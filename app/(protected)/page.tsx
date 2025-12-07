// /app/(protected)/page.tsx (Full updated file)

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";
import { UpdateRoleButton } from "@/components/update-role-button";

// Define an interface for the expected structure of the claims for clarity
interface SupabaseClaims {
  sub: string;
  aud: string;
  email: string;
  user_metadata: {
    role?: string; // Expect the custom role here
    [key: string]: any;
  };
  role: string; // The default Supabase role (e.g., 'authenticated')
  [key: string]: any;
}

// --- Component to fetch and display the user's role ---
async function UserRoleDisplay() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    // If authentication fails, the main UserDetails check below will handle the redirect.
    return <span className="text-red-500">Not authenticated</span>;
  }

  const claims = data.claims as SupabaseClaims;
  // Prioritize custom role in user_metadata, fall back to default 'role' claim
  const userRole = claims.user_metadata?.role || claims.role;

  return (
    <span
      className={`font-mono font-bold ${
        userRole === "admin" ? "text-green-600" : "text-blue-500"
      }`}
    >
      {userRole.toUpperCase()}
    </span>
  );
}
// -----------------------------------------------------

// --- Component to fetch and display the full claims JSON ---
async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const claims = data.claims as SupabaseClaims;

  // Returning JSON string
  return JSON.stringify(claims, null, 2);
}
// ---------------------------------------------------------

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          You are authenticated! Your current security role is:
          <Suspense
            fallback={<span className="animate-pulse">Loading...</span>}
          >
            <UserRoleDisplay />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Role Management</h2>
        <UpdateRoleButton />
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Voting Cycles</h2>
        <p className="mb-4">Manage voting cycles for movie selections.</p>
        <Link
          href="/protected/voting-cycles"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Manage Voting Cycles
        </Link>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Movies</h2>
        <p className="mb-4">See popular movies</p>
        <Link
          href="/protected/movies/popular"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Popular movies
        </Link>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your full user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
    </div>
  );
}
