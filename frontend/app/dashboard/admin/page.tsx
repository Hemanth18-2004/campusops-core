"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderKanban,
  Layers,
  FileText,
  Plus,
  Trash2,
  Shield,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getDashboardStats } from "@/src/services/adminService";
import { getCourses, createCourse, deleteCourse } from "@/src/services/courseService";
import { getSubjects, createSubject, deleteSubject } from "@/src/services/subjectService";
import { Course, Subject } from "@/src/types/academic";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    faculty: 0,
    admins: 0,
    totalCourses: 0,
    totalSubjects: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  // New Course form
  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    department: "Computer Science & Engineering",
    credits: 3,
    description: "",
  });

  // New Subject form
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    course: "",
    semester: 1,
    description: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setLoading(true);
      const [statsData, coursesData, subjectsData] = await Promise.all([
        getDashboardStats(),
        getCourses(),
        getSubjects(),
      ]);

      setStats(statsData);
      setCourses(coursesData.courses || []);
      setSubjects(subjectsData.subjects || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load admin analytics");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code) {
      toast.error("Course name and code are required");
      return;
    }

    try {
      await createCourse(courseForm);
      toast.success("Course created successfully!");
      setShowCourseModal(false);
      setCourseForm({
        name: "",
        code: "",
        department: "Computer Science & Engineering",
        credits: 3,
        description: "",
      });
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course and its subjects?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      loadAllData();
    } catch (err: any) {
      toast.error("Failed to delete course");
    }
  }

  async function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code || !subjectForm.course) {
      toast.error("Subject name, code, and parent course are required");
      return;
    }

    try {
      await createSubject(subjectForm);
      toast.success("Subject created successfully!");
      setShowSubjectModal(false);
      setSubjectForm({
        name: "",
        code: "",
        course: "",
        semester: 1,
        description: "",
      });
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create subject");
    }
  }

  async function handleDeleteSubject(id: string) {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      toast.success("Subject deleted successfully");
      loadAllData();
    } catch (err: any) {
      toast.error("Failed to delete subject");
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
            <Shield className="w-3.5 h-3.5" />
            Administrative Center
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Operations Command
          </h1>
          <p className="text-sm text-slate-500">
            Real-time infrastructure management for courses, curricula, and campus personnel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Users className="w-4 h-4" />
            Manage Users
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowCourseModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            New Subject
          </button>
        </div>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalUsers}</div>
          <div className="mt-1 text-xs text-slate-500">
            {stats.students} Students • {stats.faculty} Faculty • {stats.admins} Admins
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courses</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalCourses}</div>
          <div className="mt-1 text-xs text-slate-500">Active degree curricula</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subjects</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalSubjects}</div>
          <div className="mt-1 text-xs text-slate-500">Course modules taught</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignments</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalAssignments}</div>
          <div className="mt-1 text-xs text-slate-500">{stats.totalSubmissions} Submissions tracked</div>
        </div>
      </div>

      {/* Main Management Sections: Courses & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courses Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Curriculum Courses
              </h2>
              <p className="text-xs text-slate-500">Degree programs registered in CampusOps</p>
            </div>
            <button
              onClick={() => setShowCourseModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Course
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No courses defined yet.</div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700">
                        {course.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">{course.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.description || course.department}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Credits: {course.credits || 3} • {course.department || "General"}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Subjects & Modules
              </h2>
              <p className="text-xs text-slate-500">Assigned subject modules and parent courses</p>
            </div>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subject
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No subjects registered yet.</div>
            ) : (
              subjects.map((sub) => {
                const courseName = typeof sub.course === "object" ? (sub.course as any)?.name : "Course";
                return (
                  <div key={sub._id} className="py-3.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {sub.code}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">{sub.name}</h3>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Course: <span className="font-medium text-slate-700">{courseName}</span> • Semester {sub.semester || 1}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(sub._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Course</h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electrical & Computer Engineering"
                  required
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ECE-100"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={courseForm.department}
                  onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Program overview and objective..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Subject</h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS-301"
                    required
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Parent Course
                </label>
                <select
                  required
                  value={subjectForm.course}
                  onChange={(e) => setSubjectForm({ ...subjectForm, course: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="">Select a Course...</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key topics and module goals..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
