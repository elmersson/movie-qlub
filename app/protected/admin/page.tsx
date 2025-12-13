import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Info, Users } from "lucide-react";
import { Tables } from "@/src/types/supabase.types";
import UserList from "@/components/admin/user-list";

// Define the type for the data we fetch
type Profile = Tables<"profiles">;

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Check for Admin Access
  const { data: claimsData } = await supabase.auth.getClaims();
  const userClaims = claimsData?.claims;
  const callerRole = userClaims?.user_metadata?.role || userClaims?.role;

  // If user is not admin, redirect them out
  if (callerRole !== "admin") {
    // Note: You might want to redirect to a 403 Forbidden page instead
    redirect("/protected");
  }

  // 2. Fetch all user data (REPLACING the getProfiles call)
  const { data: profiles, error } = await supabase
    .from("profiles") // ✅ Now 'supabase' is the resolved client, and .from() works
    .select("*")
    .order("username", { ascending: true });

  if (error) {
    console.error("Error fetching profiles:", error); // Handle the error gracefully
  }

  const safeProfiles: Profile[] = profiles || []; // Ensure profiles is an array

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-8 py-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-red-500">
        <Users className="w-8 h-8" /> Admin User Management
      </h1>

      <div className="bg-red-500/10 text-sm p-3 px-5 rounded-md text-red-500 flex gap-3 items-center">
        <Info size="16" strokeWidth={2} />
        You are viewing a restricted page. Your user role is:{" "}
        {callerRole.toUpperCase()}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
          All System Users ({safeProfiles.length})
        </h2>
        <UserList initialProfiles={safeProfiles} />
      </div>
    </div>
  );
}
