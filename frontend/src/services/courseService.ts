import api from "@/src/lib/api";
import { Course } from "@/src/types/academic";

export async function getCourses(): Promise<{ courses: Course[] }> {
  const res = await api.get("/courses");
  return res.data;
}

export async function getCourse(id: string): Promise<{ course: Course; subjects: any[] }> {
  const res = await api.get(`/courses/${id}`);
  return res.data;
}

export async function createCourse(data: {
  name: string;
  code: string;
  description?: string;
  department?: string;
  credits?: number;
  faculty?: string;
}): Promise<{ course: Course }> {
  const res = await api.post("/courses", data);
  return res.data;
}

export async function updateCourse(
  id: string,
  data: Partial<Course>
): Promise<{ course: Course }> {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
}

export async function deleteCourse(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
}
