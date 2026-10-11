import LessonPlan from "../models/LessonPlan.js";
import { generateLessonPlanWithAI } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @route POST /api/v1/lesson-plans/generate (Faculty / Admin)
export const generatePlan = asyncHandler(async (req, res) => {
  const { subject, topic, duration, targetAudience } = req.body;

  if (!subject || !topic) {
    throw new AppError("Subject and topic are required to generate a lesson plan", 400);
  }

  const result = await generateLessonPlanWithAI({
    subject,
    topic,
    duration: duration || "45 minutes",
    targetAudience,
  });

  res.status(200).json({
    success: true,
    message: "Lesson plan generated successfully",
    source: result.source,
    plan: {
      subject,
      topic,
      duration: duration || "45 minutes",
      content: result.content,
    },
  });
});

// @route GET /api/v1/lesson-plans (Faculty / Admin)
export const getLessonPlans = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "faculty") {
    filter.faculty = req.user._id;
  }

  const plans = await LessonPlan.find(filter)
    .populate("faculty", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: plans.length,
    plans,
  });
});

// @route GET /api/v1/lesson-plans/:id
export const getLessonPlanById = asyncHandler(async (req, res) => {
  const plan = await LessonPlan.findById(req.params.id).populate("faculty", "name email");

  if (!plan) {
    throw new AppError("Lesson plan not found", 404);
  }

  res.status(200).json({
    success: true,
    plan,
  });
});

// @route POST /api/v1/lesson-plans (Faculty / Admin)
export const createLessonPlan = asyncHandler(async (req, res) => {
  const { subject, topic, duration, objectives, content } = req.body;

  if (!subject || !topic || !content) {
    throw new AppError("Subject, topic, and content are required", 400);
  }

  const plan = await LessonPlan.create({
    subject,
    topic,
    duration: duration || "45 minutes",
    objectives: Array.isArray(objectives) ? objectives : [],
    content,
    faculty: req.user._id,
  });

  const populated = await LessonPlan.findById(plan._id).populate("faculty", "name email");

  res.status(201).json({
    success: true,
    message: "Lesson plan saved successfully",
    plan: populated,
  });
});

// @route PUT /api/v1/lesson-plans/:id (Faculty / Admin)
export const updateLessonPlan = asyncHandler(async (req, res) => {
  const { subject, topic, duration, objectives, content } = req.body;

  const plan = await LessonPlan.findById(req.params.id);
  if (!plan) {
    throw new AppError("Lesson plan not found", 404);
  }

  if (req.user.role === "faculty" && plan.faculty.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to edit this lesson plan", 403);
  }

  if (subject) plan.subject = subject;
  if (topic) plan.topic = topic;
  if (duration) plan.duration = duration;
  if (objectives !== undefined) plan.objectives = Array.isArray(objectives) ? objectives : [];
  if (content) plan.content = content;

  await plan.save();

  const updated = await LessonPlan.findById(plan._id).populate("faculty", "name email");

  res.status(200).json({
    success: true,
    message: "Lesson plan updated successfully",
    plan: updated,
  });
});

// @route DELETE /api/v1/lesson-plans/:id (Faculty / Admin)
export const deleteLessonPlan = asyncHandler(async (req, res) => {
  const plan = await LessonPlan.findById(req.params.id);
  if (!plan) {
    throw new AppError("Lesson plan not found", 404);
  }

  if (req.user.role === "faculty" && plan.faculty.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete this lesson plan", 403);
  }

  await LessonPlan.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Lesson plan deleted successfully",
  });
});
