"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Send,
  Loader2,
  Eye,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAssignments, createAssignment, deleteAssignment } from "@/src/services/assignmentService";
import { getSubmissions, gradeSubmission } from "@/src/services/submissionService";
import { getSubjects } from "@/src/services/subjectService";
import {
  generateLessonPlan,
  getLessonPlans,
  createLessonPlan,
  deleteLessonPlan,
} from "@/src/services/lessonPlanService";
import { Assignment, Submission, Subject, LessonPlan } from "@/src/types/academic";

export default function FacultyDashboardPage() {
  const [activeTab, setActiveTab] = useState<"assignments" | "grading" | "ai" | "plans">("assignments");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // New assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    maxMarks: 100,
  });

  // Grading modal state
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(100);
  const [gradeFeedback, setGradeFeedback] = useState<string>("");
  const [gradingLoading, setGradingLoading] = useState(false);

  // AI Generator state
  const [aiForm, setAiForm] = useState({
    subject: "Data Structures & Algorithms",
    topic: "",
    duration: "45 minutes",
  });
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    subject: string;
    topic: string;
    duration: string;
    content: string;
    source?: string;
  } | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    loadFacultyData();
  }, []);

  async function loadFacultyData() {
    try {
      setLoading(true);
      const [assignRes, subRes, subjRes, planRes] = await Promise.all([
        getAssignments(),
        getSubmissions(),
        getSubjects(),
        getLessonPlans(),
      ]);

      setAssignments(assignRes.assignments || []);
      setSubmissions(subRes.submissions || []);
      setSubjects(subjRes.subjects || []);
      setLessonPlans(planRes.plans || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load faculty portal data");
    } finally {
      setLoading(false);
    }
  }

  // Create Assignment
  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!assignForm.title || !assignForm.description || !assignForm.subject || !assignForm.dueDate) {
      toast.error("All assignment fields are required");
      return;
    }

    try {
      await createAssignment(assignForm);
      toast.success("Assignment published successfully!");
      setShowAssignModal(false);
      setAssignForm({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
        maxMarks: 100,
      });
      loadFacultyData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish assignment");
    }
  }

  // Delete Assignment
  async function handleDeleteAssignment(id: string) {
    if (!confirm("Are you sure you want to delete this assignment and submissions?")) return;
    try {
      await deleteAssignment(id);
      toast.success("Assignment deleted");
      loadFacultyData();
    } catch (err: any) {
      toast.error("Failed to delete assignment");
    }
  }

  // Submit Grade
  async function handleGradeSubmission(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      setGradingLoading(true);
      await gradeSubmission(selectedSubmission._id, {
        grade: Number(gradeScore),
        feedback: gradeFeedback,
      });
      toast.success("Grade and feedback saved!");
      setSelectedSubmission(null);
      loadFacultyData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to grade submission");
    } finally {
      setGradingLoading(false);
    }
  }

  // AI Lesson Plan Generation
  async function handleGenerateLessonPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!aiForm.subject || !aiForm.topic) {
      toast.error("Subject and Topic are required");
      return;
    }

    try {
      setAiGenerating(true);
      const res = await generateLessonPlan(aiForm);
      setGeneratedPlan({
        ...res.plan,
        source: res.source,
      });
      toast.success(`Lesson plan created via ${res.source || "AI"}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate lesson plan");
    } finally {
      setAiGenerating(false);
    }
  }

  // Save generated plan
  async function handleSaveLessonPlan() {
    if (!generatedPlan) return;

    try {
      setSavingPlan(true);
      await createLessonPlan({
        subject: generatedPlan.subject,
        topic: generatedPlan.topic,
        duration: generatedPlan.duration,
        content: generatedPlan.content,
      });
      toast.success("Lesson plan saved to library!");
      setGeneratedPlan(null);
      loadFacultyData();
      setActiveTab("plans");
    } catch (err: any) {
      toast.error("Failed to save lesson plan");
    } finally {
      setSavingPlan(false);
    }
  }

  // Delete saved plan
  async function handleDeletePlan(id: string) {
    if (!confirm("Are you sure you want to delete this lesson plan?")) return;
    try {
      await deleteLessonPlan(id);
      toast.success("Lesson plan removed");
      loadFacultyData();
    } catch (err: any) {
      toast.error("Failed to delete lesson plan");
    }
  }

  const pendingGradingCount = submissions.filter((s) => s.status !== "graded").length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Faculty Workspace
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Instruction & Evaluation
          </h1>
          <p className="text-sm text-slate-500">
            Publish coursework, grade student solutions, and synthesize AI lesson plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            AI Lesson Generator
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignments</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{assignments.length}</div>
          <div className="mt-1 text-xs text-slate-500">Active coursework modules</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{submissions.length}</div>
          <div className="mt-1 text-xs text-slate-500">Student answers received</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600">{pendingGradingCount}</div>
          <div className="mt-1 text-xs text-slate-500">Needs evaluation & feedback</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lesson Plans</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{lessonPlans.length}</div>
          <div className="mt-1 text-xs text-slate-500">Synthesized in library</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "assignments", label: "Assignments Manager", icon: FileText, count: assignments.length },
          { id: "grading", label: "Grading Desk", icon: ClipboardCheck, count: pendingGradingCount },
          { id: "ai", label: "AI Lesson Studio", icon: Sparkles },
          { id: "plans", label: "Saved Plans Library", icon: Bookmark, count: lessonPlans.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ASSIGNMENTS MANAGER */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Coursework & Assignments</h2>
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="w-4 h-4" />
              New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No assignments published yet. Click &quot;New Assignment&quot; to get started.
              </div>
            ) : (
              assignments.map((assign) => {
                const subjectName = typeof assign.subject === "object" ? (assign.subject as any)?.name : "Subject";
                const subjectCode = typeof assign.subject === "object" ? (assign.subject as any)?.code : "SUB";
                const formattedDate = new Date(assign.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={assign._id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {subjectCode}
                        </span>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Due: {formattedDate}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{assign.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{assign.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3 text-slate-600">
                        <span>Max Marks: <strong>{assign.maxMarks}</strong></span>
                        <span>Submissions: <strong>{assign.submissionCount || 0}</strong></span>
                      </div>
                      <button
                        onClick={() => handleDeleteAssignment(assign._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GRADING DESK */}
      {activeTab === "grading" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Submissions</h2>
              <p className="text-xs text-slate-500">Review, grade, and provide actionable feedback on submitted work</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Assignment</th>
                    <th className="px-6 py-4">Submitted At</th>
                    <th className="px-6 py-4">Status / Score</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => {
                      const studentName = sub.student?.name || "Student";
                      const studentEmail = sub.student?.email || "";
                      const assignTitle = typeof sub.assignment === "object" ? (sub.assignment as any)?.title : "Assignment";
                      const maxMarks = typeof sub.assignment === "object" ? (sub.assignment as any)?.maxMarks : 100;
                      const dateStr = new Date(sub.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <div>{studentName}</div>
                            <div className="text-xs text-slate-400 font-mono">{studentEmail}</div>
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-800">{assignTitle}</td>

                          <td className="px-6 py-4 text-xs text-slate-500">{dateStr}</td>

                          <td className="px-6 py-4">
                            {sub.status === "graded" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Award className="w-3.5 h-3.5" />
                                {sub.grade} / {maxMarks}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                Needs Grading
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setGradeScore(sub.grade !== null && sub.grade !== undefined ? sub.grade : maxMarks);
                                setGradeFeedback(sub.feedback || "");
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {sub.status === "graded" ? "Edit Grade" : "Review & Grade"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI LESSON STUDIO */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">AI Pedagogical Designer</h2>
                <p className="text-xs text-slate-500">Generate lecture timeline & curriculum content</p>
              </div>
            </div>

            <form onSubmit={handleGenerateLessonPlan} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Database Systems"
                  required
                  value={aiForm.subject}
                  onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Topic / Subtopic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paxos Consensus Algorithm & Quorum"
                  required
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Class Duration
                </label>
                <select
                  value={aiForm.duration}
                  onChange={(e) => setAiForm({ ...aiForm, duration: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="30 minutes">30 minutes (Micro-lesson)</option>
                  <option value="45 minutes">45 minutes (Standard period)</option>
                  <option value="60 minutes">60 minutes (Lecture seminar)</option>
                  <option value="90 minutes">90 minutes (Lab / Block period)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={aiGenerating}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing Curriculum...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Lesson Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Result & Editor */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[460px]">
            {generatedPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                      {generatedPlan.source || "AI Generated"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{generatedPlan.topic}</h3>
                  </div>

                  <button
                    onClick={handleSaveLessonPlan}
                    disabled={savingPlan}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {savingPlan ? "Saving..." : "Save to Library"}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={16}
                    value={generatedPlan.content}
                    onChange={(e) =>
                      setGeneratedPlan({ ...generatedPlan, content: e.target.value })
                    }
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="max-w-sm">
                  <h4 className="text-sm font-bold text-slate-700">AI Plan Preview</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter a subject and topic on the left to synthesize high-depth lesson plans with Bloom&apos;s Taxonomy objectives.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SAVED PLANS LIBRARY */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Saved Lesson Plans</h2>
              <p className="text-xs text-slate-500">Instructional frameworks saved for semester courses</p>
            </div>
            <button
              onClick={() => setActiveTab("ai")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create New Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonPlans.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No saved lesson plans yet. Generate one in the AI Studio tab!
              </div>
            ) : (
              lessonPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {plan.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ⏱️ {plan.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{plan.topic}</h3>
                    <div className="mt-2 text-xs font-mono text-slate-500 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {plan.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setGeneratedPlan({
                          subject: plan.subject,
                          topic: plan.topic,
                          duration: plan.duration,
                          content: plan.content,
                          source: "Saved Library",
                        });
                        setActiveTab("ai");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View in Studio
                    </button>

                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Publish Course Assignment
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms Implementation Lab"
                  required
                  value={assignForm.title}
                  onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subject Module
                </label>
                <select
                  required
                  value={assignForm.subject}
                  onChange={(e) => setAssignForm({ ...assignForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="">Select Target Subject...</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={assignForm.dueDate}
                    onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={assignForm.maxMarks}
                    onChange={(e) => setAssignForm({ ...assignForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Problem Description & Instructions
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the technical specifications, requirements, and evaluation rubrics..."
                  value={assignForm.description}
                  onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & GRADE SUBMISSION MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review & Grade Work</h3>
                <p className="text-xs text-slate-500">
                  Student: <strong>{selectedSubmission.student?.name}</strong> ({selectedSubmission.student?.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Student's Content */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Submitted Solution Content
              </label>
              <div className="max-h-48 overflow-y-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-mono">
                {selectedSubmission.content}
              </div>
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Grade Score (out of{" "}
                  {typeof selectedSubmission.assignment === "object"
                    ? (selectedSubmission.assignment as any)?.maxMarks
                    : 100}
                  )
                </label>
                <input
                  type="number"
                  min="0"
                  max={
                    typeof selectedSubmission.assignment === "object"
                      ? (selectedSubmission.assignment as any)?.maxMarks
                      : 100
                  }
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Faculty Critique & Written Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide guidance, performance praise, or correction notes..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={gradingLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {gradingLoading ? "Submitting..." : "Save Grade & Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}