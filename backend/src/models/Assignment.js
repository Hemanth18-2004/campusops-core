import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject association is required"],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty creator is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
