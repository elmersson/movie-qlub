"use client";

import React from "react";
import { useActionState } from "react";
import { updateOtherUserRole } from "@/actions/admin";
import { Loader2 } from "lucide-react";
import { Tables } from "@/src/types/supabase.types";
import { useFormStatus } from "react-dom";

type Profile = Tables<"profiles">;
type NewRole = "user" | "admin";

// Type for the action state
type ActionState =
  | { success: true; message: string }
  | { success: false; error: string }
  | null;
const initialState: ActionState = null;

// --- RoleToggle Component ---
function RoleToggle({ profile }: { profile: Profile }) {
  // Use the action state for local feedback
  const [state, formAction] = useActionState(
    updateOtherUserRole.bind(
      null,
      profile.id,
      profile.role === "admin" ? "user" : "admin"
    ),
    initialState
  );
  const { pending } = useFormStatus();

  const currentRole = profile.role as NewRole;
  const targetRole = currentRole === "admin" ? "user" : "admin";
  const isTargetAdmin = targetRole === "admin";

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={pending}
        className={`
          px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 w-32
          ${
            pending
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isTargetAdmin
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }
        `}
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
        ) : (
          `Set to ${targetRole.toUpperCase()}`
        )}
      </button>

      {state && (
        <p
          className={`text-xs ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.success ? state.message : state.error}
        </p>
      )}
    </form>
  );
}

// --- Main UserList Component ---
export default function UserList({
  initialProfiles,
}: {
  initialProfiles: Profile[];
}) {
  // We use useState here to show the list, but note that the revalidatePath
  // in the Server Action will reload the Server Component (/admin/page.tsx)
  // and pass the freshly fetched list back down, ensuring the data is fresh.

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 font-bold text-gray-600 border-b pb-2">
        <span>Email / Username</span>
        <span>ID</span>
        <span>Current Role</span>
        <span>Action</span>
      </div>

      {initialProfiles.map((profile) => (
        <div
          key={profile.id}
          className={`grid grid-cols-4 items-center py-2 border-b last:border-b-0 ${
            profile.role === "admin" ? "bg-red-50/50" : ""
          }`}
        >
          {/* Email / Username */}
          <div className="flex flex-col">
            <span className="font-medium">{profile.email || "N/A"}</span>
            <span className="text-xs text-gray-500">
              {profile.username || "No username"}
            </span>
          </div>

          {/* ID */}
          <span className="font-mono text-xs text-gray-500 truncate">
            {profile.id}
          </span>

          {/* Current Role */}
          <span
            className={`font-mono font-bold ${
              profile.role === "admin" ? "text-green-600" : "text-blue-500"
            }`}
          >
            {profile.role.toUpperCase()}
          </span>

          {/* Action Button */}
          <div>
            <RoleToggle profile={profile} />
          </div>
        </div>
      ))}
    </div>
  );
}
