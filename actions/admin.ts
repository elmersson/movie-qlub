"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Type definition for the required input and response
type RoleUpdateResponse = { success: true; message: string } | { success: false; error: string };
type NewRole = 'user' | 'admin';

/**
 * Updates the role of a specified user (targetUserId) in the profiles table.
 * ACCESS: Requires the caller to have the 'admin' role.
 * * NOTE: This action is separate from the self-update action to ensure strict
 * authorization checks when modifying OTHER users.
 * * @param targetUserId The ID of the user whose role is being changed.
 * @param newRole The role to assign ('user' or 'admin').
 */
export async function updateOtherUserRole(
  targetUserId: string,
  newRole: NewRole
): Promise<RoleUpdateResponse> {
  const supabase = await createClient();

  // 1. Authorization Check: Verify the caller's role
  const { data: claimsData } = await supabase.auth.getClaims();
  const callerRole = claimsData?.claims?.user_metadata?.role || claimsData?.claims?.role;

  if (callerRole !== 'admin') {
    return { success: false, error: "Unauthorized access: Only admins can change other users' roles." };
  }

  // 2. Update the role in the 'profiles' table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', targetUserId); 

  if (updateError) {
    console.error("Error updating target user role:", updateError.message);
    return { success: false, error: `Database error: ${updateError.message}` };
  }

  // 3. Force a session refresh for the target user (if possible/necessary)
  // NOTE: We cannot easily force the target user's session to refresh from here, 
  // so the change will take effect for the target user on their next login or session refresh.
  
  // 4. Revalidate the admin page path to show the immediate change in the list
  revalidatePath("/app/(protected)/admin");

  return { success: true, message: `Role for user ID ${targetUserId} successfully set to ${newRole}.` };
}