import mongoose from "mongoose";

const lessonPlanSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    duration: {
      type: String,
      default: "45 minutes",
    },
    objectives: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: [true, "Lesson plan content is required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LessonPlan = mongoose.model("LessonPlan", lessonPlanSchema);
export default LessonPlan;
