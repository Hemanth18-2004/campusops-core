import api from "@/src/lib/api";
import { Assignment } from "@/src/types/academic";

export async function getAssignments(params?: {
  subjectId?: string;
  facultyId?: string;
}): Promise<{ assignments: Assignment[] }> {
  const query = new URLSearchParams();
  if (params?.subjectId) query.append("subjectId", params.subjectId);
  if (params?.facultyId) query.append("facultyId", params.facultyId);

  const res = await api.get(`/assignments${query.toString() ? "?" + query.toString() : ""}`);
  return res.data;
}

export async function getAssignment(id: string): Promise<{ assignment: Assignment }> {
  const res = await api.get(`/assignments/${id}`);
  return res.data;
}

export async function createAssignment(data: {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  maxMarks?: number;
}): Promise<{ assignment: Assignment }> {
  const res = await api.post("/assignments", data);
  return res.data;
}

export async function updateAssignment(
  id: string,
  data: Partial<Assignment>
): Promise<{ assignment: Assignment }> {
  const res = await api.put(`/assignments/${id}`, data);
  return res.data;
}

export async function deleteAssignment(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
}
