import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  gradeSubmission,
} from "../controllers/submissionController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getSubmissions)
  .post(authorize("student"), createSubmission);

router.route("/:id")
  .get(getSubmissionById);

router.route("/:id/grade")
  .post(authorize("faculty", "admin"), gradeSubmission);

export default router;
