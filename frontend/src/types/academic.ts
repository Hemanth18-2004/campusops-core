export interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
  credits?: number;
  faculty?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  course: Course | string;
  faculty?: {
    _id: string;
    name: string;
    email: string;
  };
  semester?: number;
  description?: string;
  createdAt?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: Subject | { _id: string; name: string; code: string };
  faculty: { _id: string; name: string; email: string };
  dueDate: string;
  maxMarks: number;
  submissionCount?: number;
  gradedCount?: number;
  mySubmission?: Submission | null;
  createdAt?: string;
}

export interface Submission {
  _id: string;
  assignment: Assignment | { _id: string; title: string; dueDate?: string; maxMarks?: number };
  student: { _id: string; name: string; email: string };
  content: string;
  fileUrl?: string;
  status: "submitted" | "graded" | "pending";
  grade?: number | null;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface LessonPlan {
  _id: string;
  subject: string;
  topic: string;
  duration: string;
  objectives?: string[];
  content: string;
  faculty: { _id: string; name: string; email: string };
  createdAt?: string;
}
