// components/update-role-button.tsx

"use client";

import React, { useFormStatus } from "react-dom";
// Use ActionState from React
import { useActionState } from "react";
import { setAdminRole, setUserRole } from "@/actions/actions";
import { CheckCircle, Loader2 } from "lucide-react";

// Define the shape of the role update response
type ActionState =
  | {
      success: boolean;
      message: string;
      error?: string;
    }
  | {
      success: false;
      message?: undefined;
      error: string;
    }
  | null;

const initialState: ActionState = null;

// Helper button component to handle pending state
function SubmitButton({ role }: { role: "admin" | "user" }) {
  const { pending } = useFormStatus();
  const isTargetAdmin = role === "admin";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors duration-200 w-32 text-center flex items-center justify-center gap-2
        ${
          pending
            ? "bg-gray-500 text-white cursor-not-allowed"
            : isTargetAdmin
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }
      `}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Updating...
        </>
      ) : (
        `Set to ${role.toUpperCase()}`
      )}
    </button>
  );
}

// Main component
export function UpdateRoleButton({
  currentRole,
}: {
  currentRole: "user" | "admin";
}) {
  // 1. Replaced useFormState with React.useActionState for the 'admin' action
  const [adminState, adminAction] = useActionState(setAdminRole, initialState);

  // 2. Replaced useFormState with React.useActionState for the 'user' action
  const [userState, userAction] = useActionState(setUserRole, initialState);

  // Determine the relevant state and action based on the current role
  const targetAction = currentRole === "user" ? adminAction : userAction;
  const statusState = currentRole === "user" ? adminState : userState;
  const targetRole = currentRole === "user" ? "admin" : "user";

  // The state to manage user feedback is now directly the result of the action
  const feedback = statusState;

  // NOTE: The previous useEffect hook for managing a separate feedback state
  // and clearing the message is no longer needed if we rely solely on the
  // `useActionState` result for feedback, which persists until the next action.

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <p className="text-sm text-foreground/80">
        Click below to toggle your role in the `profiles` table. A successful
        update forces a session refresh to update your JWT claims.
      </p>

      {/* Main Form: Switches to the OPPOSITE role */}
      <form
        action={targetAction}
        className="flex flex-col gap-4 p-4 border rounded-lg"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Current Role:</span>
          <span
            className={`font-mono font-bold text-xl ${
              currentRole === "admin" ? "text-green-600" : "text-blue-500"
            }`}
          >
            {currentRole.toUpperCase()}
          </span>
        </div>

        <SubmitButton role={targetRole} />
      </form>

      {/* Global Status Message */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            feedback.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.success && <CheckCircle size={16} />}
          {/* Display message or error */}
          {feedback.message || feedback.error}
        </div>
      )}
    </div>
  );
}
