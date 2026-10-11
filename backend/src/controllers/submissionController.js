import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @route GET /api/v1/submissions
export const getSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId, studentId, status } = req.query;
  const filter = {};

  // If student, ONLY return their own submissions
  if (req.user.role === "student") {
    filter.student = req.user._id;
  } else {
    // Faculty or Admin
    if (studentId) filter.student = studentId;
  }

  if (assignmentId) filter.assignment = assignmentId;
  if (status) filter.status = status;

  const submissions = await Submission.find(filter)
    .populate("student", "name email")
    .populate({
      path: "assignment",
      select: "title dueDate maxMarks subject faculty",
      populate: {
        path: "subject",
        select: "name code",
      },
    })
    .sort({ submittedAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    submissions,
  });
});

// @route GET /api/v1/submissions/:id
export const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate("student", "name email")
    .populate({
      path: "assignment",
      select: "title description dueDate maxMarks subject faculty",
      populate: {
        path: "subject",
        select: "name code",
      },
    });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Student can only see their own
  if (
    req.user.role === "student" &&
    submission.student._id.toString() !== req.user._id.toString()
  ) {
    throw new AppError("Not authorized to view this submission", 403);
  }

  res.status(200).json({
    success: true,
    submission,
  });
});

// @route POST /api/v1/submissions (Student only)
export const createSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, content, fileUrl } = req.body;

  if (!assignmentId || !content) {
    throw new AppError("Assignment ID and submission content are required", 400);
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  // Check if student already submitted
  let submission = await Submission.findOne({
    assignment: assignmentId,
    student: req.user._id,
  });

  if (submission) {
    // Update existing submission if before deadline or re-submission allowed
    submission.content = content;
    submission.fileUrl = fileUrl || submission.fileUrl;
    submission.submittedAt = new Date();
    submission.status = "submitted";
    await submission.save();

    const populated = await Submission.findById(submission._id)
      .populate("student", "name email")
      .populate("assignment", "title dueDate maxMarks");

    return res.status(200).json({
      success: true,
      message: "Submission updated successfully",
      submission: populated,
    });
  }

  submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    content,
    fileUrl: fileUrl || "",
    status: "submitted",
    submittedAt: new Date(),
  });

  const populated = await Submission.findById(submission._id)
    .populate("student", "name email")
    .populate("assignment", "title dueDate maxMarks");

  res.status(201).json({
    success: true,
    message: "Assignment submitted successfully",
    submission: populated,
  });
});

// @route POST /api/v1/submissions/:id/grade (Faculty / Admin)
export const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;

  if (grade === undefined || grade === null) {
    throw new AppError("Grade score is required", 400);
  }

  const submission = await Submission.findById(req.params.id).populate("assignment");
  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const numGrade = Number(grade);
  if (isNaN(numGrade) || numGrade < 0) {
    throw new AppError("Grade must be a valid non-negative number", 400);
  }

  submission.grade = numGrade;
  submission.feedback = feedback || "";
  submission.status = "graded";
  submission.gradedAt = new Date();

  await submission.save();

  const populated = await Submission.findById(submission._id)
    .populate("student", "name email")
    .populate("assignment", "title dueDate maxMarks");

  res.status(200).json({
    success: true,
    message: "Submission graded successfully",
    submission: populated,
  });
});
