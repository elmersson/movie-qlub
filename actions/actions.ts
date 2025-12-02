// /actions/actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";

// Define a type for the response object
type RoleUpdateResponse = {
  success: boolean;
  message: string;
  error?: undefined;
} | {
  success: false;
  message?: undefined;
  error: string;
};

export async function setAdminRole(): Promise<RoleUpdateResponse> {
  const supabase = await createClient();

  // 1. Check current user's authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  // 2. 💡 NEW LOGIC: Update the 'role' column in the 'profiles' table.
  // This update automatically triggers the Postgres function 
  // you set up to inject the new role into the user's JWT claims.
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      role: "admin", 
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id); // IMPORTANT: Only update the current user's profile

  if (updateError) {
    console.error("Error setting admin role in profile:", updateError.message);
    return { success: false, error: "Failed to set admin role: " + updateError.message };
  }

  // 3. 💡 ESSENTIAL FIX: Force a session refresh to get the new JWT.
  // This is required to pick up the role change that the Postgres trigger just applied.
  const { error: refreshError } = await supabase.auth.refreshSession();

  if (refreshError) {
    // If refresh fails, they might be logged out or the session is invalid.
    return { success: false, error: "Role updated, but failed to refresh session: " + refreshError.message };
  }
  
  return { success: true, message: "Role updated to 'admin'. Refreshing page..." };
}