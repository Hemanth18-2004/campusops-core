import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      uppercase: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course association is required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    semester: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
