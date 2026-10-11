import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import lessonPlanRoutes from "./routes/lessonPlanRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import logger from "./middleware/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Base route
app.get("/", (req, res) => {
  res.send("CampusOps Backend is running 🚀");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/lesson-plans", lessonPlanRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", healthRoutes);

// Error handler
app.use(errorHandler);

export default app;
