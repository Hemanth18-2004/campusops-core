"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Shield,
  BookOpen,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import UserSearch from "@/src/components/dashboard/tables/UserSearch";
import UserTable from "@/src/components/dashboard/tables/UserTable";
import EditUserModal from "@/src/components/dashboard/modals/EditUserModal";
import DeleteUserModal from "@/src/components/dashboard/modals/DeleteUserModal";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/src/services/adminService";
import { User } from "@/src/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "faculty" | "admin",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers(1, 50, "", selectedRole);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setCreating(true);
      await createUser(newUser);
      toast.success("User created successfully!");
      setCreateOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateUser(data: {
    name: string;
    email: string;
    role: User["role"];
  }) {
    if (!selectedUser) return;

    try {
      const response = await updateUser(selectedUser._id, data);
      toast.success("User updated successfully");
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === selectedUser._id ? response.user : user
        )
      );
      setSelectedUser(null);
      setEditOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== id)
      );
      setSelectedUser(null);
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  }

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q);
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Center
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Personnel & Access Management
          </h1>
          <p className="text-sm text-slate-500">
            Provision roles, manage credentials, and audit active users across CampusOps.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Role Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <UserSearch value={search} onChange={setSearch} />
        </div>

        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl self-start md:self-auto">
          {[
            { label: "All Roles", value: "" },
            { label: "Students", value: "student" },
            { label: "Faculty", value: "faculty" },
            { label: "Admins", value: "admin" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedRole(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === tab.value
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        onEdit={(user) => {
          setSelectedUser(user);
          setEditOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteOpen(true);
        }}
      />

      {/* Create User Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Register New User
              </h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marie Curie"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. mcurie@campusops.com"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Temporary Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  System Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as "student" | "faculty" | "admin",
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty / Instructor</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUser}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        user={selectedUser}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}