import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @route GET /api/v1/courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("faculty", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
});

// @route GET /api/v1/courses/:id
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("faculty", "name email");

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Also fetch related subjects
  const subjects = await Subject.find({ course: course._id }).populate("faculty", "name email");

  res.status(200).json({
    success: true,
    course,
    subjects,
  });
});

// @route POST /api/v1/courses (Admin only)
export const createCourse = asyncHandler(async (req, res) => {
  const { name, code, description, department, credits, faculty } = req.body;

  if (!name || !code) {
    throw new AppError("Course name and code are required", 400);
  }

  const existing = await Course.findOne({ code: code.toUpperCase() });
  if (existing) {
    throw new AppError(`Course with code ${code.toUpperCase()} already exists`, 400);
  }

  const course = await Course.create({
    name,
    code: code.toUpperCase(),
    description: description || "",
    department: department || "General",
    credits: credits ? Number(credits) : 3,
    faculty: faculty || null,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

// @route PUT /api/v1/courses/:id (Admin only)
export const updateCourse = asyncHandler(async (req, res) => {
  const { name, code, description, department, credits, faculty } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (code && code.toUpperCase() !== course.code) {
    const existing = await Course.findOne({ code: code.toUpperCase() });
    if (existing) {
      throw new AppError(`Course code ${code.toUpperCase()} already in use`, 400);
    }
    course.code = code.toUpperCase();
  }

  if (name) course.name = name;
  if (description !== undefined) course.description = description;
  if (department) course.department = department;
  if (credits !== undefined) course.credits = Number(credits);
  if (faculty !== undefined) course.faculty = faculty || null;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course,
  });
});

// @route DELETE /api/v1/courses/:id (Admin only)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // Also remove subjects under this course
  await Subject.deleteMany({ course: course._id });
  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Course and affiliated subjects deleted successfully",
  });
});
