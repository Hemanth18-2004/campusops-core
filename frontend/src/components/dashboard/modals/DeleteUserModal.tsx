"use client";

import { useState } from "react";
import { User } from "@/src/types/user";

interface Props {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function DeleteUserModal({
  user,
  open,
  onClose,
  onDelete,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  if (!open || !user) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await onDelete(user._id);

      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[450px] rounded-xl bg-white p-6 shadow-xl">

        <h2 className="text-2xl font-bold">
          Delete User
        </h2>

        <p className="mt-4">
          Are you sure you want to delete
          <strong> {user.name}</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-4">

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
}