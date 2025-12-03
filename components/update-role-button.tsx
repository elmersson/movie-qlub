// /components/UpdateRoleButton.tsx

"use client";

import { useState } from "react";
import { setAdminRole } from "@/actions/actions"; // Import the Server Action

export function UpdateRoleButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    // Call the Server Action
    const result = await setAdminRole();

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(result.message);
      // To immediately reflect the change in UserDetails component, a page reload is necessary
      // as the claims are part of the server-side fetched session.
      // window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-150"
      >
        {loading ? "Updating Role..." : "Assign Yourself 'admin' Role"}
      </button>
      {message && (
        <p
          className={`text-sm ${
            message.startsWith("Error") ? "text-red-500" : "text-gray-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
