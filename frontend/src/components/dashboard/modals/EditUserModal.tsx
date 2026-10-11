"use client";

import { useEffect, useState } from "react";
import { User } from "@/src/types/user";

interface Props {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    role: User["role"];
  }) => Promise<void> | void;
}

export default function EditUserModal({
  user,
  open,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("student");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  if (!open || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        name: name.trim(),
        email: email.trim(),
        role,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[450px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="mb-1 block font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block font-medium">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as User["role"])
              }
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}