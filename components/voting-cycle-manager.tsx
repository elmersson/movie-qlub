// /components/voting-cycle-manager.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Define the VotingCycle type
type VotingCycle = {
  id: string;
  name: string;
  suggestionStart: string;
  votingStart: string;
  votingEnd: string;
  winnerId: string | null;
};

export function VotingCycleManager({ initialCycles }: { initialCycles: VotingCycle[] }) {
  const [votingCycles, setVotingCycles] = useState<VotingCycle[]>(initialCycles);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VotingCycle>>({
    name: "",
    suggestionStart: "",
    votingStart: "",
    votingEnd: "",
  });

  const supabase = createClient();

  const handleCreate = async () => {
    const { error } = await supabase
      .from("VotingCycle")
      .insert({
        name: formData.name,
        suggestionStart: formData.suggestionStart,
        votingStart: formData.votingStart,
        votingEnd: formData.votingEnd,
      });

    if (error) {
      console.error("Error creating voting cycle:", error);
      return;
    }

    // Reset form and refresh data
    setFormData({
      name: "",
      suggestionStart: "",
      votingStart: "",
      votingEnd: "",
    });
    setIsCreating(false);
    refreshCycles();
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("VotingCycle")
      .update({
        name: formData.name,
        suggestionStart: formData.suggestionStart,
        votingStart: formData.votingStart,
        votingEnd: formData.votingEnd,
      })
      .eq("id", editingId);

    if (error) {
      console.error("Error updating voting cycle:", error);
      return;
    }

    // Reset form and refresh data
    setFormData({
      name: "",
      suggestionStart: "",
      votingStart: "",
      votingEnd: "",
    });
    setEditingId(null);
    refreshCycles();
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this voting cycle?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("VotingCycle")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting voting cycle:", error);
      return;
    }

    refreshCycles();
  };

  const refreshCycles = async () => {
    const { data, error } = await supabase
      .from("VotingCycle")
      .select("*")
      .order("votingEnd", { ascending: true });

    if (error) {
      console.error("Error refreshing voting cycles:", error);
      return;
    }

    setVotingCycles(data || []);
  };

  const startEditing = (cycle: VotingCycle) => {
    setEditingId(cycle.id);
    setFormData({
      name: cycle.name,
      suggestionStart: formatDateTimeForInput(cycle.suggestionStart),
      votingStart: formatDateTimeForInput(cycle.votingStart),
      votingEnd: formatDateTimeForInput(cycle.votingEnd),
    });
  };

  const formatDateTimeForInput = (dateString: string) => {
    // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      name: "",
      suggestionStart: "",
      votingStart: "",
      votingEnd: "",
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">Voting Cycles</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          {isCreating ? "Cancel" : "Create New"}
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="border rounded-md p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">
            {editingId ? "Edit Voting Cycle" : "Create New Voting Cycle"}
          </h3>
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Monthly Movie Vote"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="suggestionStart" className="block text-sm font-medium mb-1">
                  Suggestion Start
                </label>
                <input
                  type="datetime-local"
                  id="suggestionStart"
                  value={formData.suggestionStart || ""}
                  onChange={(e) => setFormData({ ...formData, suggestionStart: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="votingStart" className="block text-sm font-medium mb-1">
                  Voting Start
                </label>
                <input
                  type="datetime-local"
                  id="votingStart"
                  value={formData.votingStart || ""}
                  onChange={(e) => setFormData({ ...formData, votingStart: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="votingEnd" className="block text-sm font-medium mb-1">
                  Voting End
                </label>
                <input
                  type="datetime-local"
                  id="votingEnd"
                  value={formData.votingEnd || ""}
                  onChange={(e) => setFormData({ ...formData, votingEnd: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                onClick={cancelEditing}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {votingCycles.length === 0 ? (
          <p>No voting cycles found.</p>
        ) : (
          votingCycles.map((cycle) => (
            <div key={cycle.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/protected/voting-cycles/${cycle.id}`}>
                      <h3 className="font-bold text-lg hover:text-blue-500">{cycle.name}</h3>
                    </Link>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-gray-500">Suggestion Period</span>
                      <p>
                        {new Date(cycle.suggestionStart).toLocaleDateString()} -{" "}
                        {new Date(cycle.votingStart).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Voting Period</span>
                      <p>
                        {new Date(cycle.votingStart).toLocaleDateString()} -{" "}
                        {new Date(cycle.votingEnd).toLocaleDateString()}
                      </p>
                    </div>
<div>
                      <span className="text-sm text-gray-500">Status</span>
                      <p>
                        {new Date() < new Date(cycle.suggestionStart)
                          ? "Not Started"
                          : new Date() < new Date(cycle.votingStart)
                          ? "Suggestion Phase"
                          : new Date() < new Date(cycle.votingEnd)
                          ? "Voting Phase"
                          : "Ended"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(cycle)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cycle.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}