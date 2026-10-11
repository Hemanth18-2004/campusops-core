"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Upload,
  Send,
  BookOpen,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAssignments } from "@/src/services/assignmentService";
import { getSubmissions, createSubmission } from "@/src/services/submissionService";
import { getSubjects } from "@/src/services/subjectService";
import { Assignment, Submission, Subject } from "@/src/types/academic";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"assignments" | "submissions" | "curriculum">("assignments");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFileUrl, setSubmissionFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  async function loadStudentData() {
    try {
      setLoading(true);
      const [assignRes, subRes, subjRes] = await Promise.all([
        getAssignments(),
        getSubmissions(),
        getSubjects(),
      ]);

      setAssignments(assignRes.assignments || []);
      setSubmissions(subRes.submissions || []);
      setSubjects(subjRes.subjects || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load student portal");
    } finally {
      setLoading(false);
    }
  }

  // Handle Submission
  async function handleSubmitSolution(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssignment || !submissionContent.trim()) {
      toast.error("Please provide your solution response");
      return;
    }

    try {
      setSubmitting(true);
      await createSubmission({
        assignmentId: selectedAssignment._id,
        content: submissionContent.trim(),
        fileUrl: submissionFileUrl.trim(),
      });

      toast.success("Assignment submitted successfully!");
      setSelectedAssignment(null);
      setSubmissionContent("");
      setSubmissionFileUrl("");
      loadStudentData();
      setActiveTab("submissions");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate stats
  const totalAssignmentsCount = assignments.length;
  const submittedCount = submissions.length;
  const gradedList = submissions.filter((s) => s.status === "graded" && typeof s.grade === "number");
  const gradedCount = gradedList.length;
  const averageGrade =
    gradedCount > 0
      ? Math.round(gradedList.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedCount)
      : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Academic Desk
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Learning Portal & Coursework
          </h1>
          <p className="text-sm text-slate-500">
            Track syllabus deadlines, submit solution artifacts, and review faculty evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("assignments")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4" />
            Active Tasks
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{totalAssignmentsCount}</div>
          <div className="mt-1 text-xs text-slate-500">Coursework assignments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{submittedCount}</div>
          <div className="mt-1 text-xs text-slate-500">Submissions turned in</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluated</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600">{gradedCount}</div>
          <div className="mt-1 text-xs text-slate-500">Graded by instructors</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Grade</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {gradedCount > 0 ? `${averageGrade}%` : "—"}
          </div>
          <div className="mt-1 text-xs text-slate-500">Across graded submissions</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "assignments", label: "Course Assignments", icon: FileText, count: totalAssignmentsCount },
          { id: "submissions", label: "My Submissions & Grades", icon: Award, count: submittedCount },
          { id: "curriculum", label: "Curriculum Modules", icon: Layers, count: subjects.length },
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

      {/* TAB 1: ASSIGNMENTS FEED */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Assigned Coursework</h2>
            <span className="text-xs text-slate-500">
              Submit your solutions before the designated due date
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No active assignments assigned yet. Check back soon!
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

                // Find if already submitted
                const existingSub = submissions.find(
                  (s) => (typeof s.assignment === "object" ? (s.assignment as any)?._id : s.assignment) === assign._id
                );

                const isGraded = existingSub?.status === "graded";
                const isSubmitted = Boolean(existingSub);

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
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                        {assign.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Max Marks: <strong>{assign.maxMarks}</strong>
                      </div>

                      {isGraded ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Award className="w-3.5 h-3.5" />
                          Graded: {existingSub?.grade}/{assign.maxMarks}
                        </span>
                      ) : isSubmitted ? (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assign);
                            setSubmissionContent(existingSub?.content || "");
                            setSubmissionFileUrl(existingSub?.fileUrl || "");
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Update Submission
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assign);
                            setSubmissionContent("");
                            setSubmissionFileUrl("");
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Submit Solution
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY SUBMISSIONS & GRADES */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Submission Evaluation Records</h2>
            <span className="text-xs text-slate-500">
              View instructor grading scores and written comments
            </span>
          </div>

          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                You have not submitted any assignments yet.
              </div>
            ) : (
              submissions.map((sub) => {
                const assignTitle = typeof sub.assignment === "object" ? (sub.assignment as any)?.title : "Assignment";
                const maxMarks = typeof sub.assignment === "object" ? (sub.assignment as any)?.maxMarks : 100;
                const dateStr = new Date(sub.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={sub._id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Assignment Solution
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{assignTitle}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Submitted: {dateStr}</span>
                        {sub.status === "graded" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Award className="w-3.5 h-3.5" />
                            Score: {sub.grade} / {maxMarks}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Under Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="text-xs font-semibold text-slate-700 uppercase mb-1">
                        Your Submitted Text
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {sub.content}
                      </div>
                    </div>

                    {/* Faculty Feedback Section */}
                    {sub.feedback && (
                      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                        <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-600" />
                          Faculty Instructor Feedback
                        </div>
                        <p className="text-xs text-indigo-800 leading-relaxed">{sub.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM MODULES */}
      {activeTab === "curriculum" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Academic Curriculum & Subjects</h2>
            <span className="text-xs text-slate-500">Modules available across university degree tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No syllabus subjects registered yet.
              </div>
            ) : (
              subjects.map((subj) => {
                const courseName = typeof subj.course === "object" ? (subj.course as any)?.name : "Course";
                const facultyName = typeof subj.faculty === "object" ? (subj.faculty as any)?.name : "Faculty";

                return (
                  <div
                    key={subj._id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {subj.code}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Semester {subj.semester || 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{subj.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{subj.description || "Course module curriculum"}</p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      Degree Track: <strong className="text-slate-700">{courseName}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Assignment Solution</h3>
                <p className="text-xs text-slate-500">{selectedAssignment.title}</p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-semibold text-slate-800">Task Requirements:</div>
              <div className="max-h-24 overflow-y-auto whitespace-pre-wrap">{selectedAssignment.description}</div>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Your Solution & Written Work
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste your source code, mathematical proofs, or essay response..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Artifact Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-repo or Drive link"
                  value={submissionFileUrl}
                  onChange={(e) => setSubmissionFileUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? "Submitting..." : (
                    <>
                      <Send className="w-4 h-4" />
                      Turn In Solution
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}