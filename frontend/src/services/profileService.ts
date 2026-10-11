import api from "@/src/lib/api";
import { User } from "@/src/types/user";

export async function getProfile(): Promise<{ user: User; message: string }> {
  const res = await api.get("/profile");
  return res.data;
}
