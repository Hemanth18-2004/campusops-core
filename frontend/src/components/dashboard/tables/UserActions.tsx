"use client";

import { Pencil, Trash2 } from "lucide-react";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserActions({ onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
        title="Edit User"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        onClick={onDelete}
        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}