import Subject from "../models/Subject.js";
import Course from "../models/Course.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @route GET /api/v1/subjects
export const getSubjects = asyncHandler(async (req, res) => {
  const { courseId, facultyId } = req.query;
  const filter = {};

  if (courseId) filter.course = courseId;
  if (facultyId) filter.faculty = facultyId;

  const subjects = await Subject.find(filter)
    .populate("course", "name code department")
    .populate("faculty", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subjects.length,
    subjects,
  });
});

// @route GET /api/v1/subjects/:id
export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id)
    .populate("course", "name code department")
    .populate("faculty", "name email");

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  res.status(200).json({
    success: true,
    subject,
  });
});

// @route POST /api/v1/subjects (Admin only)
export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, course, faculty, semester, description } = req.body;

  if (!name || !code || !course) {
    throw new AppError("Subject name, code, and parent course are required", 400);
  }

  const courseDoc = await Course.findById(course);
  if (!courseDoc) {
    throw new AppError("Referenced course not found", 404);
  }

  const subject = await Subject.create({
    name,
    code: code.toUpperCase(),
    course,
    faculty: faculty || null,
    semester: semester ? Number(semester) : 1,
    description: description || "",
  });

  const populated = await Subject.findById(subject._id)
    .populate("course", "name code department")
    .populate("faculty", "name email");

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    subject: populated,
  });
});

// @route PUT /api/v1/subjects/:id (Admin only)
export const updateSubject = asyncHandler(async (req, res) => {
  const { name, code, course, faculty, semester, description } = req.body;

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  if (name) subject.name = name;
  if (code) subject.code = code.toUpperCase();
  if (course) subject.course = course;
  if (faculty !== undefined) subject.faculty = faculty || null;
  if (semester !== undefined) subject.semester = Number(semester);
  if (description !== undefined) subject.description = description;

  await subject.save();

  const updated = await Subject.findById(subject._id)
    .populate("course", "name code department")
    .populate("faculty", "name email");

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    subject: updated,
  });
});

// @route DELETE /api/v1/subjects/:id (Admin only)
export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  await Subject.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
  });
});
