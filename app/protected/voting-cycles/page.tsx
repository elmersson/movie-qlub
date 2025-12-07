// /app/protected/voting-cycles/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { VotingCycleManager } from "@/components/voting-cycle-manager";

export default async function VotingCyclesPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  
  // Fetch voting cycles
  const { data: votingCycles, error } = await supabase
    .from("VotingCycle")
    .select("*")
    .order("votingEnd", { ascending: true });
  
  if (error) {
    console.error("Error loading voting cycles:", error);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="font-bold text-2xl mb-4">Voting Cycles Management</h1>
        <p className="text-foreground">
          Create and manage voting cycles for movie selections.
        </p>
      </div>
      
      <div className="w-full">
        <Suspense fallback={<div>Loading voting cycles...</div>}>
          <VotingCycleManager initialCycles={votingCycles || []} />
        </Suspense>
      </div>
    </div>
  );
}