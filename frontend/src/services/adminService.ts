import api from "@/src/lib/api";
import { UsersResponse, User } from "@/src/types/user";

export async function getDashboardStats() {
  const res = await api.get("/admin/dashboard");
  return res.data;
}

export async function getUsers(
  page = 1,
  limit = 10,
  search = "",
  role = ""
): Promise<UsersResponse> {
  const roleParam = role ? `&role=${role}` : "";
  const res = await api.get(
    `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${roleParam}`
  );
  return res.data;
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role: "student" | "faculty" | "admin";
}) {
  const res = await api.post("/admin/users", data);
  return res.data;
}

export async function updateUser(
  id: string,
  data: Partial<User>
) {

  const res = await api.put(
    `/admin/users/${id}`,
    data
  );

  return res.data;
}

export async function deleteUser(id: string) {

  const res = await api.delete(
    `/admin/users/${id}`
  );

  return res.data;
}

export async function changeRole(
  id: string,
  role: string
) {

  const res = await api.patch(
    `/admin/users/${id}/role`,
    { role }
  );

  return res.data;
}

export async function toggleStatus(id: string) {

  const res = await api.patch(
    `/admin/users/${id}/status`
  );

  return res.data;
}