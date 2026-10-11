"use client";

import { User } from "@/src/types/user";
import UserActions from "./UserActions";
import { Shield, BookOpen, GraduationCap } from "lucide-react";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );
      case "faculty":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <BookOpen className="w-3 h-3" />
            Faculty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3 h-3" />
            Student
          </span>
        );
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
        No campus users match the search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </td>

                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user.email}</td>

                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                <td className="px-6 py-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex justify-end">
                    <UserActions
                      onEdit={() => onEdit(user)}
                      onDelete={() => onDelete(user)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}