import api from "@/src/lib/api";
import { Subject } from "@/src/types/academic";

export async function getSubjects(params?: {
  courseId?: string;
  facultyId?: string;
}): Promise<{ subjects: Subject[] }> {
  const query = new URLSearchParams();
  if (params?.courseId) query.append("courseId", params.courseId);
  if (params?.facultyId) query.append("facultyId", params.facultyId);

  const res = await api.get(`/subjects${query.toString() ? "?" + query.toString() : ""}`);
  return res.data;
}

export async function getSubject(id: string): Promise<{ subject: Subject }> {
  const res = await api.get(`/subjects/${id}`);
  return res.data;
}

export async function createSubject(data: {
  name: string;
  code: string;
  course: string;
  faculty?: string;
  semester?: number;
  description?: string;
}): Promise<{ subject: Subject }> {
  const res = await api.post("/subjects", data);
  return res.data;
}

export async function updateSubject(
  id: string,
  data: Partial<Subject>
): Promise<{ subject: Subject }> {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data;
}

export async function deleteSubject(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
}
