import api from "@/src/lib/api";
import { LessonPlan } from "@/src/types/academic";

export async function generateLessonPlan(data: {
  subject: string;
  topic: string;
  duration?: string;
  targetAudience?: string;
}): Promise<{
  success: boolean;
  message: string;
  source: string;
  plan: {
    subject: string;
    topic: string;
    duration: string;
    content: string;
  };
}> {
  const res = await api.post("/lesson-plans/generate", data);
  return res.data;
}

export async function getLessonPlans(): Promise<{ plans: LessonPlan[] }> {
  const res = await api.get("/lesson-plans");
  return res.data;
}

export async function getLessonPlan(id: string): Promise<{ plan: LessonPlan }> {
  const res = await api.get(`/lesson-plans/${id}`);
  return res.data;
}

export async function createLessonPlan(data: {
  subject: string;
  topic: string;
  duration?: string;
  objectives?: string[];
  content: string;
}): Promise<{ plan: LessonPlan; message: string }> {
  const res = await api.post("/lesson-plans", data);
  return res.data;
}

export async function updateLessonPlan(
  id: string,
  data: Partial<LessonPlan>
): Promise<{ plan: LessonPlan; message: string }> {
  const res = await api.put(`/lesson-plans/${id}`, data);
  return res.data;
}

export async function deleteLessonPlan(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/lesson-plans/${id}`);
  return res.data;
}
