import Assignment from "../models/Assignment.js";
import Subject from "../models/Subject.js";
import Submission from "../models/Submission.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @route GET /api/v1/assignments
export const getAssignments = asyncHandler(async (req, res) => {
  const { subjectId, facultyId } = req.query;
  const filter = {};

  if (subjectId) filter.subject = subjectId;
  if (facultyId) filter.faculty = facultyId;

  // If user is faculty, they can see assignments they created or all
  const assignments = await Assignment.find(filter)
    .populate("subject", "name code course")
    .populate("faculty", "name email")
    .sort({ dueDate: 1 });

  // Enrich with submission counts
  const enriched = await Promise.all(
    assignments.map(async (assign) => {
      const submissionCount = await Submission.countDocuments({ assignment: assign._id });
      const gradedCount = await Submission.countDocuments({ assignment: assign._id, status: "graded" });

      // If user is student, check if this student has submitted
      let mySubmission = null;
      if (req.user && req.user.role === "student") {
        mySubmission = await Submission.findOne({
          assignment: assign._id,
          student: req.user._id,
        });
      }

      return {
        ...assign.toObject(),
        submissionCount,
        gradedCount,
        mySubmission,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: enriched.length,
    assignments: enriched,
  });
});

// @route GET /api/v1/assignments/:id
export const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate("subject", "name code")
    .populate("faculty", "name email");

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  let mySubmission = null;
  if (req.user && req.user.role === "student") {
    mySubmission = await Submission.findOne({
      assignment: assignment._id,
      student: req.user._id,
    });
  }

  const submissionCount = await Submission.countDocuments({ assignment: assignment._id });

  res.status(200).json({
    success: true,
    assignment: {
      ...assignment.toObject(),
      submissionCount,
      mySubmission,
    },
  });
});

// @route POST /api/v1/assignments (Faculty/Admin)
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, subject, dueDate, maxMarks } = req.body;

  if (!title || !description || !subject || !dueDate) {
    throw new AppError("Title, description, subject, and dueDate are required", 400);
  }

  const subjectDoc = await Subject.findById(subject);
  if (!subjectDoc) {
    throw new AppError("Specified subject does not exist", 404);
  }

  const assignment = await Assignment.create({
    title,
    description,
    subject,
    course: subjectDoc.course,
    faculty: req.user._id,
    dueDate: new Date(dueDate),
    maxMarks: maxMarks ? Number(maxMarks) : 100,
  });

  const populated = await Assignment.findById(assignment._id)
    .populate("subject", "name code")
    .populate("faculty", "name email");

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    assignment: populated,
  });
});

// @route PUT /api/v1/assignments/:id (Faculty/Admin)
export const updateAssignment = asyncHandler(async (req, res) => {
  const { title, description, subject, dueDate, maxMarks } = req.body;

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  // Check ownership if faculty
  if (req.user.role === "faculty" && assignment.faculty.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to modify another instructor's assignment", 403);
  }

  if (title) assignment.title = title;
  if (description) assignment.description = description;
  if (subject) assignment.subject = subject;
  if (dueDate) assignment.dueDate = new Date(dueDate);
  if (maxMarks !== undefined) assignment.maxMarks = Number(maxMarks);

  await assignment.save();

  const updated = await Assignment.findById(assignment._id)
    .populate("subject", "name code")
    .populate("faculty", "name email");

  res.status(200).json({
    success: true,
    message: "Assignment updated successfully",
    assignment: updated,
  });
});

// @route DELETE /api/v1/assignments/:id (Faculty/Admin)
export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  if (req.user.role === "faculty" && assignment.faculty.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete another instructor's assignment", 403);
  }

  // Remove submissions linked to this assignment
  await Submission.deleteMany({ assignment: assignment._id });
  await Assignment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Assignment and submissions deleted successfully",
  });
});
