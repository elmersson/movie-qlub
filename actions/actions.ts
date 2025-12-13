"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

// --- Action to set role to ADMIN ---
export async function setAdminRole(): Promise<RoleUpdateResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  // Update the 'role' column to 'admin'
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      role: "admin", 
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id); 

  if (updateError) {
    console.error("Error setting admin role in profile:", updateError.message);
    return { success: false, error: "Failed to set admin role: " + updateError.message };
  }

  // Force a session refresh to get the new JWT with the updated role claim.
  const { error: refreshError } = await supabase.auth.refreshSession();

  if (refreshError) {
    return { success: false, error: "Role updated, but failed to refresh session: " + refreshError.message };
  }
  
  // Revalidate path to force the Server Component to re-read the new claims
  revalidatePath("/app/(protected)/page");
  
  return { success: true, message: "Role updated to 'admin'. Refreshing page..." };
}


// --- Action to set role to USER ---
export async function setUserRole(): Promise<RoleUpdateResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  // Update the 'role' column to 'user'
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      role: "user", 
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id); 

  if (updateError) {
    console.error("Error setting user role in profile:", updateError.message);
    return { success: false, error: "Failed to set user role: " + updateError.message };
  }

  // Force a session refresh to get the new JWT with the updated role claim.
  const { error: refreshError } = await supabase.auth.refreshSession();

  if (refreshError) {
    return { success: false, error: "Role updated, but failed to refresh session: " + refreshError.message };
  }
  
  // Revalidate path to force the Server Component to re-read the new claims
  revalidatePath("/app/(protected)/page");
  
  return { success: true, message: "Role updated to 'user'. Refreshing page..." };
}