import api from "@/src/lib/api";
import { Submission } from "@/src/types/academic";

export async function getSubmissions(params?: {
  assignmentId?: string;
  studentId?: string;
  status?: string;
}): Promise<{ submissions: Submission[] }> {
  const query = new URLSearchParams();
  if (params?.assignmentId) query.append("assignmentId", params.assignmentId);
  if (params?.studentId) query.append("studentId", params.studentId);
  if (params?.status) query.append("status", params.status);

  const res = await api.get(`/submissions${query.toString() ? "?" + query.toString() : ""}`);
  return res.data;
}

export async function getSubmission(id: string): Promise<{ submission: Submission }> {
  const res = await api.get(`/submissions/${id}`);
  return res.data;
}

export async function createSubmission(data: {
  assignmentId: string;
  content: string;
  fileUrl?: string;
}): Promise<{ submission: Submission; message: string }> {
  const res = await api.post("/submissions", data);
  return res.data;
}

export async function gradeSubmission(
  id: string,
  data: {
    grade: number;
    feedback?: string;
  }
): Promise<{ submission: Submission; message: string }> {
  const res = await api.post(`/submissions/${id}/grade`, data);
  return res.data;
}
